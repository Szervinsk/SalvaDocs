import { useState, useEffect } from "react";
import { Icons } from "../../../constants/icons"; // Ajuste o caminho se necessário
import "./account.css";
import axios from "axios";
import logoImage from '../../../assets/Photo.png';

function Account({ user, onUserUpdate, onLogout, showAlert, onDataChange }) {
  // --- Estados do Formulário Principal ---
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    empresa: user?.empresa || "",
    apiKey: "",
  });

  // --- Estados do Modal de Senha ---
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  // Atualiza dados quando o user muda
  useEffect(() => {
    setFormData({
      username: user?.username || "",
      empresa: user?.empresa || "",
      apiKey: "",
    });
  }, [user]);

  // --- Funções Auxiliares ---
  const getInitials = (name = "") => {
    if (!name) return "";
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Não disponível";
    return new Date(dateString).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // --- Handlers do Formulário Principal ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancelar edição: reseta para o valor original
      setFormData({ username: user.username, empresa: user.empresa || "", apiKey: "" });
    }
    setIsEditing(prev => !prev);
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    const payload = {};
    
    if (formData.username !== user.username) payload.username = formData.username;
    if (formData.empresa !== (user.empresa || "")) payload.empresa = formData.empresa;
    if (formData.apiKey) payload.apiKey = formData.apiKey;

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      const response = await axios.put("/users", payload);
      onUserUpdate(response.data);
      setIsEditing(false);
      showAlert("success", "Perfil atualizado com sucesso!");
      if (onDataChange) onDataChange();
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      showAlert("error", err.response?.data?.error || "Não foi possível atualizar o perfil.");
    }
  };

  // --- Handlers de Exclusão e Reset ---
  const handleDeleteAccount = async () => {
    if (window.confirm("Você tem CERTEZA que deseja excluir sua conta? Esta ação é irreversível.")) {
      try {
        await axios.delete(`/users`);
        showAlert("success", "Sua conta foi excluída com sucesso.");
        onLogout();
      } catch (err) {
        console.error("Erro ao excluir conta:", err);
        showAlert("error", err.response?.data?.error || "Não foi possível excluir o perfil.");
      }
    }
  };

  const handleResetWelcome = async () => {
    try {
      await axios.put('/users/welcome/reset');
      showAlert("success", "A tela de boas-vindas será exibida no próximo login.");
      onUserUpdate({ ...user, welcomeDismissed: false });
    } catch (err) {
      showAlert("error", "Não foi possível resetar a tela de boas-vindas.");
    }
  };

  // --- Handlers de Senha (CORRIGIDO) ---
  
  // 1. Apenas abre o modal
  const openPasswordModal = () => {
    setShowPasswordModal(true);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  };

  // 2. Atualiza os inputs do modal
  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  // 3. Envia os dados para o backend
  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
        showAlert("error", "A confirmação da nova senha não confere.");
        return;
    }

    if (passwordForm.newPassword.length < 6) {
        showAlert("error", "A nova senha deve ter pelo menos 6 caracteres.");
        return;
    }

    try {
      // Envia o objeto correto para o backend
      await axios.put('/users/changepassword', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmNewPassword: passwordForm.confirmNewPassword
      });
      
      showAlert("success", "Senha alterada com sucesso!");
      setShowPasswordModal(false); // Fecha o modal
      
    } catch (err) {
      console.error("Erro ao mudar senha:", err);
      showAlert("error", err.response?.data?.error || "Não foi possível alterar a senha.");
    }
  };

  return (
    <div className="account-page">
      <header className="account-header">
        <h1>Minha Conta</h1>
        <p>Gerencie suas informações pessoais, de segurança e chaves de API.</p>
      </header>

      <form onSubmit={handleSubmitProfile} className="account-layout">
        <aside className="account-sidebar">
          <div className="profile-card">
            <div className="profile-avatar">
              {user?.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" /> : <span>{getInitials(user?.username)}</span>}
            </div>
            <h2 className="profile-name">{user.username}</h2>
            <p className="profile-email">{user.email}</p>
            <div className="profile-actions">
              {isEditing ? (
                <div style={{display: "flex" , gap: "5px"}}>
                  <button type="submit" className="btn-primary">Salvar</button>
                  <div className="btn-secondary" style={{cursor: "pointer"}} onClick={handleEditToggle}>Cancelar</div>
                </div>
              ) : (
                <div className="btn-primary" style={{width: "100%" , cursor: "pointer"}} onClick={handleEditToggle}>Editar Perfil</div>
              )}
            </div>
          </div>
        </aside>

        <main className="account-main">
          {/* Card de Informações Pessoais */}
          <div className="details-card">
            <div className="details-card__header"><h3>Informações Pessoais</h3></div>
            <div className="details-card__body">
              <div className="info-row">
                <div className="info-row__label"><Icons.User size={16} /><span>Nome de Usuário</span></div>
                {isEditing ? <input type="text" name="username" className="form-input" value={formData.username} onChange={handleInputChange} required /> : <span className="info-row__value">{user?.username}</span>}
              </div>
              <div className="info-row">
                <div className="info-row__label"><Icons.Business size={16} /><span>Empresa</span></div>
                {isEditing ? <input type="text" name="empresa" className="form-input" value={formData.empresa} onChange={handleInputChange} placeholder="Opcional" /> : <span className="info-row__value">{user?.empresa || "-"}</span>}
              </div>
              <div className="info-row">
                <div className="info-row__label"><Icons.Email size={16} /><span>Email</span></div>
                <span className="info-row__value">{user?.email}</span>
              </div>
              <div className="info-row">
                <div className="info-row__label"><Icons.Calendar size={16} /><span>Membro desde</span></div>
                <span className="info-row__value">{formatDate(user?.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Card de Segurança */}
          <div className="details-card">
            <div className="details-card__header"><h3>Gerenciamento e Segurança</h3></div>
            <div className="details-card__body">
              <div className="info-row">
                <div className="info-row__label"><Icons.Key size={16} /><span>Status da Chave Gemini</span></div>
                <span className={`info-row__value tag-plan ${user.hasApiKey ? 'active' : ''}`}>{user.hasApiKey ? "Configurada" : "Não configurada"}</span>
              </div>
              
              {isEditing && (
                <div className="info-row">
                  <div className="info-row__label"><Icons.Add size={16} /><span>Nova Chave API Gemini</span></div>
                  <input type="password" name="apiKey" className="form-input" value={formData.apiKey} onChange={handleInputChange} placeholder="Cole sua nova chave para atualizar" />
                </div>
              )}

              <div className="info-row--action">
                <span>Altere sua senha para manter sua conta segura.</span>
                {/* CORREÇÃO: Agora abre o modal em vez de chamar API direto */}
                <button type="button" className="btn-secondary" onClick={openPasswordModal}>Alterar Senha</button>
              </div>

              <div className="info-row--action">
                <span>Veja o tour de boas-vindas novamente.</span>
                <button type="button" className="btn-secondary" onClick={handleResetWelcome}>Ver Boas-Vindas</button>
              </div>
            </div>
          </div>

          {/* Zona de Perigo */}
          <div className="details-card danger-zone">
            <div className="details-card__header"><h3>Zona de Perigo</h3></div>
            <div className="details-card__body">
              <div className="info-row--action">
                <div><strong>Excluir esta conta</strong><p>Uma vez que você exclui sua conta, não há volta. Tenha certeza.</p></div>
                <button type="button" className="btn-danger" onClick={handleDeleteAccount}>Excluir Conta</button>
              </div>
            </div>
          </div>
        </main>
      </form>

      {/* --- MODAL DE ALTERAR SENHA (NOVO) --- */}
      {showPasswordModal && (
        <div className="modal-overlay">
          {/* O modal-content agora é o "card" de autenticação */}
          <div className="modal-content auth-style-card"> 
            
            {/* Botão de fechar (essencial para modal) */}
            <button type="button" className="auth-close-btn" onClick={() => setShowPasswordModal(false)}>&times;</button>

            {/* Logo e Cabeçalho */}
            <div className="auth-header-logo">
              <img src={logoImage} alt="SalvaDocs" className="auth-logo" /> 
              <h2>Alterar Senha</h2>
              <p>Para sua segurança, informe sua senha atual e a nova.</p>
            </div>

            <form onSubmit={handleSubmitPassword} className="modal-form">
              
              {/* Grupo de Input (Senha Atual) */}
              <div className="auth-input-group">
                <label htmlFor="currentPassword">Senha Atual</label>
                <input 
                  id="currentPassword"
                  type="password" 
                  name="currentPassword"
                  className="auth-input-field" // Nova classe
                  value={passwordForm.currentPassword} 
                  onChange={handlePasswordChangeInput} 
                  required 
                />
              </div>
              
              {/* Grupo de Input (Nova Senha) */}
              <div className="auth-input-group">
                <label htmlFor="newPassword">Nova Senha</label>
                <input 
                  id="newPassword"
                  type="password" 
                  name="newPassword"
                  className="auth-input-field" 
                  value={passwordForm.newPassword} 
                  onChange={handlePasswordChangeInput} 
                  required 
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              
              {/* Grupo de Input (Confirmar) */}
              <div className="auth-input-group">
                <label htmlFor="confirmNewPassword">Confirmar Nova Senha</label>
                <input 
                  id="confirmNewPassword"
                  type="password" 
                  name="confirmNewPassword"
                  className="auth-input-field" 
                  value={passwordForm.confirmNewPassword} 
                  onChange={handlePasswordChangeInput} 
                  required 
                  placeholder="Repita a nova senha"
                />
              </div>

              <div className="auth-modal-actions">
                <button type="submit" className="auth-btn-submit">Salvar</button>
                <button type="button" className="auth-btn-cancel" onClick={() => setShowPasswordModal(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;