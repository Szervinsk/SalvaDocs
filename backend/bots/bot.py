import time
import sys
from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service 

# ALERTA: Removido o ALERTA de segurança, pois você já está ciente.

class Bot:
    def __init__(self, username, password, driver_path=None, headless=False):
        self.username = username
        self.password = password
        self.driver = None
        self.driver_path = driver_path
        self.headless = headless

    def openChrome(self):
        """ Inicia uma instância do Google Chrome com argumentos de performance. """
        options = webdriver.ChromeOptions()
        options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        
        if self.headless:
            options.add_argument("--headless=new")

        try:
            if self.driver_path:
                # Se o caminho for fornecido (ambiente empacotado ou dev)
                service = Service(self.driver_path)
                self.driver = webdriver.Chrome(service=service, options=options)
            else:
                # Se não for fornecido, o Selenium 4 tenta encontrar o driver sozinho (Dev)
                self.driver = webdriver.Chrome(options=options)
                
            print("STATUS: SUCCESS - Chrome iniciado.")
            return True
        except WebDriverException as e:
            print(f"STATUS: ERROR - Falha ao iniciar o Chrome: {e.msg}")
            return False
        except Exception as e:
            print(f"STATUS: ERROR - Erro inesperado: {e}")
            return False

    def preencher_login_html(self, url):
        """Preenche o login e espera a página principal carregar."""
        try:
            self.driver.get(url)
            # A espera pode ser lenta, ajustado o timeout para 15s (já estava bom)
            login = self.driver.find_element(by=By.ID, value="j_username")
            login.send_keys(self.username)
            
            password = self.driver.find_element(by=By.ID, value="j_password")
            password.send_keys(self.password)
            
            password.submit()
            
            WebDriverWait(self.driver, 20).until( # Aumentando a espera para 20s
                EC.element_to_be_clickable((By.LINK_TEXT, "PESQUISA"))
            )
            return True
        except Exception as e:
            print(f"STATUS: ERROR - Falha no login ou carregamento da página: {e}")
            return False

    def press_pesquisa(self):
        """Executa todo o fluxo de pesquisa e filtros."""
        # Aqui, a lógica é mantida, mas a lentidão pode vir das esperas por elementos
        try:
            # --- Ação 1: Hover no menu principal ---
            menu_principal = self.driver.find_element(By.LINK_TEXT, "PESQUISA")
            actions = ActionChains(self.driver)
            actions.move_to_element(menu_principal).perform()

            # --- Ação 2: Clique no submenu "Pesquisa avançada" ---
            submenu = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.LINK_TEXT, "Pesquisa avançada"))
            )
            submenu.click()
            
            # --- Ação 3: Clique no botão "Filtros" ---
            filtros_button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.ID, 'formPesquisaAvancadaFiltro:menuFiltrosAdicionais_button'))
            )
            filtros_button.click()

            # --- Ação 4: Clique no submenu "Unidade criadora" ---
            submenu_filtros = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.LINK_TEXT, "Unidade criadora"))
            )
            submenu_filtros.click()
            
            # --- AÇÃO 5: Preencher o campo de autocomplete ---
            campo_unidade = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.ID, "formPesquisaAvancadaFiltro:j_idt192_input"))
            )
            campo_unidade.send_keys("PRGC")

            # --- AÇÃO 5.1: Clicar na SUGESTÃO ---
            panel_id = "formPesquisaAvancadaFiltro:j_idt192_panel"
            WebDriverWait(self.driver, 10).until(
                EC.visibility_of_element_located((By.ID, panel_id))
            )
            sugestao_xpath = f"//div[@id='{panel_id}']//*[contains(text(), 'PRGC')]"
            sugestao_prgc = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, sugestao_xpath))
            )
            sugestao_prgc.click()

            # --- AÇÃO 6: Clicar em Pesquisar ---
            pesquisar_button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.ID, "formPesquisaAvancadaFiltro:btPesquisaAvancada"))
            )
            pesquisar_button.click()
            
            print("STATUS: SUCCESS - Fluxo de pesquisa concluído.")
            return True

        except Exception as e:
            print(f"STATUS: ERROR - Não foi possível completar a ação de pesquisa/filtros: {e}")
            return False

    def quit(self):
        """ Fecha o navegador e encerra o driver. """
        if self.driver:
            self.driver.quit()

# ✨ FUNÇÃO PRINCIPAL: Chamada pelo Node.js ✨
def run_main_bot_flow(username, password, url, driver_path=None):
    bot = None
    try:
        # NOTE: O CAMINHO DO DRIVER SÓ É NECESSÁRIO NO AMBIENTE EMPACOTADO
        bot = Bot(username, password, driver_path=driver_path) 
        
        if not bot.openChrome():
            return
            
        if not bot.preencher_login_html(url):
             print("STATUS: ERROR - Falha no login.")
             return
             
        if not bot.press_pesquisa():
             print("STATUS: ERROR - Falha na execução do fluxo de pesquisa.")
             return

    except Exception as e:
        print(f"STATUS: ERROR - Erro fatal durante o processo: {e}")
    finally:
        if bot:
            bot.quit()
        
# --- Bloco de Execução Principal (Recebe argumentos do Node.js) ---
if __name__ == "__main__":
    # Espera 4 argumentos: [1]username, [2]password, [3]url, [4]driver_path (opcional)
    if len(sys.argv) < 4:
        print("STATUS: ERROR - Argumentos insuficientes. Uso: bot.py <username> <password> <url> [driver_path]")
        sys.exit(1)
    
    username = sys.argv[1]
    password = sys.argv[2]
    url = sys.argv[3]
    driver_path = sys.argv[4] if len(sys.argv) > 4 else None

    run_main_bot_flow(username, password, url, driver_path)