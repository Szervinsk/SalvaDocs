import fs from "fs";
import models from "../models/index.js";
import "dotenv/config";
import { extractDataFromFile } from "../services/extractService.js";
import { extractDataWithGemini } from "../services/geminiService.js";

// ==========================================================================
// FUNÇÕES AUXILIARES
// ==========================================================================

function replaceTemplateTags(templateName, tags = []) {
  if (!templateName) return null;

  return templateName.replace(/{(.*?)}/g, (_, tagName) => {
    const tag = tags.find(
      (t) => t.name.toLowerCase() === tagName.toLowerCase() && t.value
    );
    // Se a tag for encontrada e tiver um valor, use o valor.
    // Se não, mantenha o placeholder original (ex: {Data}).
    return tag?.value ? tag.value : `{${tagName}}`;
  });
}

// ==========================================================================
// CONTROLLERS EXPORTADOS
// ==========================================================================

export const uploadFileAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    // --- 1. Receber e Validar Dados do Frontend ---
    const { model, templateName, folderId } = req.body;
    const ownerId = req.user?.id || null;

    if (!folderId) {
      return res
        .status(400)
        .json({ error: "A pasta de destino é obrigatória." });
    }

    // --- 2. Buscar Tags e Extrair Dados PRIMEIRO ---
    const parsedTagIds = req.body.tags ? JSON.parse(req.body.tags) : [];
    const selectedTags = await models.TagBase.findAll({
      where: { id: parsedTagIds },
    });

    const extractedData =
      (await extractDataFromFile(req.file.path, selectedTags)) || {};
    const iaTags = selectedTags.filter((t) => t.type === "IA");
    const regexTags = selectedTags.filter((t) => t.type === "Regex");

    // Este array conterá os OBJETOS das tags com seus valores preenchidos
    const allTagInstancesData = [];

    // Processamento de IA
    if (iaTags.length > 0) {
      try {
        const user = await models.User.findByPk(ownerId, {
          attributes: ["apiKey"],
        });
        const userApiKey = user?.apiKey || null;

        const geminiResults = await extractDataWithGemini(
          iaTags,
          extractedData.text || "",
          userApiKey
        );

        for (const tag of iaTags) {
          let value = geminiResults[tag.name] ?? null;
          if (value && typeof value === "object")
            value = JSON.stringify(value, null, 2);
          allTagInstancesData.push({
            name: tag.name,
            value,
            type: "IA",
            icon: tag.icon,
            displayCategory: tag.displayCategory,
          });
        }
      } catch (err) {
        console.error("Erro no processamento Gemini:", err.message);
        iaTags.forEach((tag) =>
          allTagInstancesData.push({
            name: tag.name,
            value: "Erro na extração IA",
            type: "IA",
            icon: tag.icon,
            displayCategory: tag.displayCategory,
          })
        );
      }
    }

    // Processamento de Regex
    for (const tag of regexTags) {
      const extracted = (extractedData.tags || []).find(
        (t) => t.name === tag.name
      );
      allTagInstancesData.push({
        name: tag.name,
        value: extracted?.value || "Não encontrado", // Usar "Não encontrado" como padrão
        type: "Regex",
        icon: tag.icon,
        displayCategory: tag.displayCategory,
      });
    }

    // --- 3. Resolver o Nome do Arquivo ---
    // Usa os dados extraídos em 'allTagInstancesData' para preencher o templateName
    const resolvedName =
      replaceTemplateTags(templateName, allTagInstancesData) ||
      req.file.originalname;

    // --- 4. Criar o Documento no Banco (AGORA com o nome correto) ---
    const document = await models.Document.create({
      name: resolvedName, 
      path: `uploads/${req.file.filename}`,
      size: req.file.size,
      model: model || "Desconhecido",
      templateName: templateName || null, // Salva o "molde" (ex: "Despacho {Data}.pdf")
      ownerId: ownerId,
      folderId: folderId,
    });

    // --- 5. Salvar as Instâncias de Tags ---
    // Adiciona o ID do documento recém-criado a cada instância de tag
    const tagsToCreate = allTagInstancesData.map((tag) => ({
      ...tag,
      documentId: document.id,
    }));

    if (tagsToCreate.length > 0) {
      await models.TagInstance.bulkCreate(tagsToCreate);
    }

    // --- 6. Buscar e Retornar o Documento Completo ---
    const documentoCompleto = await models.Document.findByPk(document.id, {
      include: [
        { model: models.TagInstance, as: "tags" },
        { model: models.Folder, as: "folder" },
      ],
    });

    // Adiciona o resolvedTemplate na resposta para consistência com o frontend
    const docJson = documentoCompleto.toJSON();
    docJson.resolvedTemplate = resolvedName;

    return res.status(201).json({
      message: "Arquivo salvo e analisado com sucesso!",
      document: docJson,
    });
  } catch (err) {
    console.error("Erro geral no upload e análise:", err.message);
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ error: "Erro ao processar o arquivo." });
  }
};

/**
 * ROTA: GET /api/documents
 * DESCRIÇÃO: Retorna todos os documentos com suas tags e pastas associadas.
 */
export const getAllDocuments = async (req, res) => {
  try {
    const documentos = await models.Document.findAll({
      include: [
        {
          model: models.TagInstance,
          as: "tags",
          attributes: [
            "id",
            "name",
            "value",
            "type",
            "icon",
            "displayCategory",
          ],
        },
        {
          model: models.Folder,
          as: "folder",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const documentosComTemplate = documentos.map((doc) => {
      const docJson = doc.toJSON();
      // O campo 'name' já é o nome resolvido. Mas o 'templateName' é o molde.
      // O frontend espera 'resolvedTemplate', então vamos usar o 'name' que já está pronto.
      docJson.resolvedTemplate = docJson.name;
      return docJson;
    });

    return res.json(documentosComTemplate);
  } catch (err) {
    console.error("Erro ao buscar documentos:", err);
    return res
      .status(500)
      .json({ error: err.message || "Erro ao buscar documentos" });
  }
};

//  ROTA: GET /api/documents/download/:id
//  DESCRIÇÃO: Força o download de um arquivo com seu nome amigável.
 
export const downloadDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    const document = await models.Document.findByPk(documentId);

    if (!document) {
      return res.status(404).json({ error: "Documento não encontrado" });
    }

    // Pega o caminho FÍSICO do arquivo no disco
    const filePath = path.resolve(document.path); 

    if (fs.existsSync(filePath)) {
      // Pega o nome AMIGÁVEL salvo no banco (o resolvedName)
      const downloadName = document.name; 

      // res.download() envia o arquivo e define o cabeçalho 'Content-Disposition'
      // Isso FORÇA o navegador a baixar o arquivo com o nome que você definir.
      res.download(filePath, downloadName, (err) => {
        if (err) {
          console.error("Erro ao enviar o arquivo:", err);
        }
      });
    } else {
      res.status(404).json({ error: "Arquivo físico não encontrado no servidor." });
    }
  } catch (err) {
    console.error("Erro ao processar download:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

/**
 * ROTA: DELETE /api/documents/:id
 * DESCRIÇÃO: Deleta um documento, suas tags e o arquivo físico do servidor. */
export const deleteDoc = async (req, res) => {
  try {
    const documentId = req.params.id;
    const document = await models.Document.findByPk(documentId);

    if (!document) {
      return res.status(404).json({ error: "Documento não encontrado" });
    }

    if (document.path) {
      try {
        const filePath = path.resolve(document.path);
        await fs.access(filePath); // Verifica se o arquivo existe
        await fs.unlink(filePath); // Deleta o arquivo
        console.log(`Arquivo físico ${filePath} deletado com sucesso.`);
      } catch (fileErr) {
        // Se o arquivo não existir ou der erro, apenas registra no log
        // mas NÃO impede a exclusão do registro do banco de dados.
        console.warn(`Aviso: Não foi possível deletar o arquivo ${document.path}. Erro: ${fileErr.message}`);
      }
    }

    // A exclusão em cascata (onDelete: 'CASCADE' no model TagInstance)
    // deve cuidar de apagar as tags. Esta linha é uma garantia extra.
    await models.TagInstance.destroy({ where: { documentId } });
    
    // Deleta o documento do banco
    await document.destroy();

    return res
      .status(200)
      .json({ message: "Documento e arquivo apagados com sucesso" });
      
  } catch (err) {
    console.error("Erro ao apagar documento:", err);
    return res.status(500).json({ error: "Erro ao apagar documento" });
  }
};