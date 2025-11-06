# Bot do Gdoc

Este é um bot de automação desenvolvido em Python com Selenium, projetado para interagir com o sistema Gdoc (Sistemas Caesb).

A principal funcionalidade do bot é realizar uma sequência de login e pesquisa avançada. Após a primeira execução, ele entra em um **modo "listener"** no console, permitindo que o usuário **repita a operação de pesquisa em uma nova aba** simplesmente pressionando 'Enter'.

## 🛠️ Tecnologia Utilizada

  * Python 3
  * Selenium (para a automação do navegador)
  * ChromeDriver (gerenciado automaticamente pelo Selenium 4+)

## ⚙️ Configuração do Ambiente

1.  **Google Chrome:**
    O bot usa o Selenium 4+, que gerencia o `chromedriver.exe` automaticamente. Você só precisa ter o navegador **Google Chrome instalado e atualizado** em sua máquina.

2.  **Bibliotecas Python:**
    É altamente recomendado usar um ambiente virtual (`venv`) para isolar as dependências do projeto.

    ```bash
    # Crie um ambiente virtual (opcional, mas recomendado)
    python -m venv venv

    # Ative o ambiente
    # Windows:
    .\venv\Scripts\activate
    # macOS/Linux:
    source venv/bin/activate

    # Instale a biblioteca necessária
    pip install selenium
    ```

## 🚀 Como Usar

1.  **Salve o código** em um arquivo chamado `bot.py` (ou o nome que preferir).
2.  **Abra um terminal** ou prompt de comando.
3.  **Navegue até a pasta** onde o script `bot.py` está salvo.
4.  **Execute o script:**
    ```bash
    python bot.py
    ```
5.  **Primeira Execução (Login):**
    O navegador será aberto. O bot fará o login (usando as credenciais do código) e executará a primeira pesquisa.
6.  **Modo "Listener":**
    Após a primeira execução, o console exibirá a mensagem:
    ```
    ==================================================
    Pressione [Enter] para executar novamente em uma nova aba
    (ou digite 'sair' para fechar):
    ==================================================
    ```
7.  **Pressione Enter** para que uma nova aba seja aberta e a pesquisa seja refeita. Digite `sair` para encerrar o bot.

-----

## ⚠️ Pontos de Atenção e Customização

Esta é a seção mais importante. O bot foi programado com valores fixos ("hardcoded"). Se qualquer um desses valores mudar (seu login, o que você procura, ou a estrutura do site Gdoc), você **precisará** atualizar o código.

### 1\. Login e Senha (Obrigatório)

**Localização:** Função `preencher_login_html`

```python
def preencher_login_html(self):
    # ...
    login = self.driver.find_element(by=By.ID, value="j_username")
    login.send_keys("SEU_NOME_DE_USUÁRIO") # <-- TROQUE AQUI
    
    password = self.driver.find_element(by=By.ID, value="j_password")
    password.send_keys("SUA_SENHA_AQUI") # <-- TROQUE AQUI
    # ...
```

  * **`send_keys("SEU_NOME_DE_USUÁRIO")`:** Troque este valor pelo seu nome de usuário Gdoc.
  * **`send_keys("SUA_SENHA_AQUI")`:** Troque este valor pela sua senha Gdoc.
      * **Alerta de Segurança:** Não é recomendado deixar senhas em texto puro no código. Para um uso mais seguro, considere usar [Variáveis de Ambiente](https://www.google.com/search?q=python+ler+variavel+de+ambiente) (ex: `os.environ.get('MINHA_SENHA')`).

### 2\. Termo de Pesquisa (Obrigatório)

**Localização:** Função `press_pesquisa`

```python
def press_pesquisa(self):
    # ...
    # --- AÇÃO 5: Preencher o campo de autocomplete ---
    campo_unidade = WebDriverWait(self.driver, 10).until(
        EC.element_to_be_clickable((By.ID, "formPesquisaAvancadaFiltro:j_idt192_input"))
    )
    campo_unidade.send_keys("PRGC") # <-- TROQUE AQUI
    
    # ...
    
    # --- AÇÃO 5.1: Clicar na SUGESTÃO ---
    # ...
    sugestao_xpath = f"//div[@id='{panel_id}']//*[contains(text(), 'PRGC')]" # <-- E TROQUE AQUI
    # ...
```

  * **`send_keys("PRGC")`:** Este é o termo que o bot digita no campo "Unidade criadora". Troque `"PRGC"` pelo termo que você deseja pesquisar.
  * **`sugestao_xpath = ... 'PRGC'`:** Esta linha procura pelo item de sugestão que aparece após digitar. Se o seu termo de pesquisa for `"XYZ"`, você **deve** trocar `'PRGC'` por `'XYZ'` aqui também.

### 3\. URL do Site

**Localização:** Final do arquivo (bloco `if __name__ == "__main__":`)

```python
if __name__ == "__main__":
    # ...
    # No bloco run_flow_task(bot, is_first_run=True)
    # ou na chamada da função:
    def run_flow_task(bot, is_first_run=False, url="https://sistemas.caesb.df.gov.br/gdoc/"):
        # ...
```

  * Se a URL principal de login do Gdoc (`https://sistemas.caesb.df.gov.br/gdoc/`) mudar, você precisará atualizá-la na definição da função `run_flow_task`.

### 4\. Seletores do Site (Manutenção Futura)

**Localização:** Função `press_pesquisa`

O bot depende inteiramente dos IDs e textos dos links do site. Se o Gdoc for atualizado (mudança de layout, mudança de IDs), o bot irá quebrar.

Se o bot falhar com um erro de `TimeoutException` ou `NoSuchElementException`, você precisará inspecionar o site e atualizar estes valores:

  * `By.LINK_TEXT, "PESQUISA"`
  * `By.LINK_TEXT, "Pesquisa avançada"`
  * `By.ID, 'formPesquisaAvancadaFiltro:menuFiltrosAdicionais_button'`
  * `By.LINK_TEXT, "Unidade criadora"`
  * `By.ID, "formPesquisaAvancadaFiltro:j_idt192_input"`
  * `By.ID, "formPesquisaAvancadaFiltro:j_idt192_panel"`
  * `By.ID, "formPesquisaAvancadaFiltro:btPesquisaAvancada"`