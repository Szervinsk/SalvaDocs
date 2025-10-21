import { useState, useEffect } from "react";
import { Icons } from "../../../constants/icons";
import "./account.css";
import axios from "axios";

function Account({ user, onUserUpdate, onLogout, showAlert }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    empresa: user?.empresa || "",
    apiKey: "",
  });

  useEffect(() => {
    setFormData({
      username: user?.username || "",
      empresa: user?.empresa || "",
      apiKey: "",
    });
  }, [user]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({ username: user.username, empresa: user.empresa || "", apiKey: "" });
    }
    setIsEditing(prev => !prev);
  };

  const handleSubmit = async (e) => {
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
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      showAlert("error", err.response?.data?.error || "Não foi possível atualizar o perfil.");
    }
  };

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
      // Chama a nova rota no backend
      await axios.put('/users/welcome/reset');
      showAlert("success", "A tela de boas-vindas será exibida no próximo login.");
      // Atualiza o estado local do usuário para refletir a mudança imediatamente
      onUserUpdate({ ...user, welcomeDismissed: false });
    } catch (err) {
      showAlert("error", "Não foi possível resetar a tela de boas-vindas.");
    }
  };

  return (
    <div className="account-page">
      <header className="account-header">
        <h1>Minha Conta</h1>
        <p>Gerencie suas informações pessoais, de segurança e chaves de API.</p>
      </header>

      <form onSubmit={handleSubmit} className="account-layout">
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
                <button type="button" className="btn-secondary">Alterar Senha</button>
              </div>
              <div className="info-row--action">
                <span>Veja o tour de boas-vindas novamente.</span>
                <button type="button" className="btn-secondary" onClick={handleResetWelcome}>Ver Boas-Vindas</button>
              </div>
            </div>
          </div>

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
    </div>
  );
}

export default Account;