import time
from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class Bot:
    def __init__(self, headless=False):
        self.driver = None
        self.headless = headless

    def openChrome(self):
        """ Inicia uma instância do Google Chrome. """
        options = webdriver.ChromeOptions()
        if self.headless:
            options.add_argument("--headless=new")

        print("Iniciando o Chrome...")
        try:
            self.driver = webdriver.Chrome(options=options)
            print("Chrome iniciado com sucesso!")
        
        except WebDriverException as e:
            print(f"Falha ao iniciar o Chrome: {e}")
            # ... (mensagens de erro) ...
        
        except Exception as e:
            print(f"Ocorreu um erro inesperado: {e}")

    def preencher_login_html(self):
        """Preenche o login e espera a página principal carregar."""
        try:
            print("Preenchendo formulário de login...")
            # ALERTA DE SEGURANÇA: Removi sua senha. Use variáveis de ambiente!
            login = self.driver.find_element(by=By.ID, value="j_username")
            login.send_keys("matheusszervinsk")
            
            password = self.driver.find_element(by=By.ID, value="j_password")
            password.send_keys("Mat110305**4") # Coloque sua senha aqui
            
            password.submit()
            print("Formulário enviado. Aguardando página principal...")
            
            # Espera a próxima página carregar (item 'PESQUISA' do menu)
            WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.LINK_TEXT, "PESQUISA"))
            )
            print("Login realizado com sucesso.")
            return True # Retorna sucesso
            
        except Exception as e:
            print(f"Erro ao tentar preencher o formulário: {e}")
            return False # Retorna falha

            
    def press_pesquisa(self):
        """Executa todo o fluxo de pesquisa e filtros."""
        try:
            # --- Ação 1: Hover no menu principal ---
            print("Movendo o mouse para 'PESQUISA'...")
            menu_principal = self.driver.find_element(By.LINK_TEXT, "PESQUISA")
            actions = ActionChains(self.driver)
            actions.move_to_element(menu_principal).perform()

            # --- Ação 2: Clique no submenu "Pesquisa avançada" ---
            print("Aguardando e clicando em 'Pesquisa avançada'...")
            submenu = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.LINK_TEXT, "Pesquisa avançada"))
            )
            submenu.click()
            
            # --- Ação 3: Clique no botão "Filtros" ---
            print("Aguardando e clicando em 'Filtros'...")
            filtros_button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.ID, 'formPesquisaAvancadaFiltro:menuFiltrosAdicionais_button'))
            )
            filtros_button.click()

            # --- Ação 4: Clique no submenu "Unidade criadora" ---
            print("Aguardando e clicando em 'Unidade criadora'...")
            submenu_filtros = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.LINK_TEXT, "Unidade criadora"))
            )
            submenu_filtros.click()
            
            # --- AÇÃO 5: Preencher o campo de autocomplete ---
            print("Aguardando campo 'Unidade Criadora' e preenchendo...")
            campo_unidade = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.ID, "formPesquisaAvancadaFiltro:j_idt192_input"))
            )
            campo_unidade.send_keys("PRGC")

            # --- AÇÃO 5.1: Clicar na SUGESTÃO (A Correção) ---
            print("Aguardando e clicando na sugestão 'PRGC'...")
            
            # 1. Esperar o PAINEL (container) ficar VISÍVEL
            panel_id = "formPesquisaAvancadaFiltro:j_idt192_panel"
            WebDriverWait(self.driver, 10).until(
                EC.visibility_of_element_located((By.ID, panel_id))
            )
            
            # 2. Esperar e Clicar no ITEM específico dentro do painel
            #    Este XPATH procura por um item que contenha 'PRGC' DENTRO do painel
            sugestao_xpath = f"//div[@id='{panel_id}']//*[contains(text(), 'PRGC')]"
            sugestao_prgc = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, sugestao_xpath))
            )
            sugestao_prgc.click()

            # --- AÇÃO 6: Clicar em Pesquisar ---
            print("Aguardando botão 'Pesquisar' e clicando...")
            pesquisar_button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.ID, "formPesquisaAvancadaFiltro:btPesquisaAvancada"))
            )
            pesquisar_button.click()
            
        
            print("Fluxo de pesquisa avançada e filtros concluído com sucesso.")
            return True # Retorna sucesso

        except Exception as e:
            print(f"Não foi possível completar a ação de pesquisa/filtros: {e}")
            return False # Retorna falha

    def quit(self):
        """ Fecha o navegador e encerra o driver. """
        if self.driver:
            print("Fechando o bot.")
            self.driver.quit()
            self.driver = None

# --- Nova Função para organizar o fluxo ---

def run_flow_task(bot, is_first_run=False, url="https://sistemas.caesb.df.gov.br/gdoc/"):
    """Executa o fluxo completo em uma aba."""
    
    try:
        if is_first_run:
            print("--- Iniciando Tarefa (Aba 1: Login) ---")
            bot.driver.get(url)
            # Tenta fazer o login
            if not bot.preencher_login_html():
                print("Falha no login. Abortando.")
                return False # Falha
        else:
            print(f"\n--- Iniciando Tarefa (Nova Aba) ---")
            # 1. Abre uma nova aba e muda o foco
            bot.driver.switch_to.new_window('tab')
            print(f"Nova aba aberta. Total de abas: {len(bot.driver.window_handles)}")
            
            # 2. Acessa a URL (deve usar a sessão de login existente)
            bot.driver.get(url)
            
            # 3. Apenas espera a página principal carregar (sem login)
            print("Aguardando página principal carregar (reutilizando sessão)...")
            WebDriverWait(bot.driver, 10).until(
                EC.element_to_be_clickable((By.LINK_TEXT, "PESQUISA"))
            )
            print("Página carregada.")
        
        # 4. Executa a pesquisa (comum para ambas as execuções)
        return bot.press_pesquisa()

    except Exception as e:
        print(f"Ocorreu um erro geral no fluxo: {e}")
        return False

# --- Bloco de Execução Principal (Com o "Listener") ---

if __name__ == "__main__":
    bot = Bot(headless=False) 
    bot.openChrome() 
    
    if bot.driver:
        # 1. Executa pela primeira vez
        success = run_flow_task(bot, is_first_run=True)
        
        if success:
            # 2. O "Listener" de repetição
            while True:
                print("\n" + "="*50)
                # O "botão" que você pediu é esta pergunta no console:
                resposta = input("Pressione [Enter] para executar novamente em uma nova aba\n(ou digite 'sair' para fechar): ")
                print("="*50)
                
                if resposta.lower() == 'sair':
                    print("Saindo...")
                    break
                    
                # 3. Executa a mesma operação, mas agora em uma nova aba
                run_flow_task(bot, is_first_run=False)
        else:
            print("Não foi possível completar a primeira execução. Encerrando.")
            
        # 4. Fecha o navegador
        bot.quit()
    else:
        print("O driver não pôde ser iniciado. Encerrando.")