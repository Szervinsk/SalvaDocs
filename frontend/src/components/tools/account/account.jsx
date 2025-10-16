import { useState, useEffect } from "react";
import { Icons } from "../../../constants/icons";
import "./account.css";
import axios from "axios";

function Account({ user, onUserUpdate, onLogout, showAlert, baseURL }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  // Reseta o formulário se o usuário mudar (ex: após logout/login)
  useEffect(() => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
    });
  }, [user]);

  const getInitials = (name = "") => {
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
      // Se estava editando (clicou em Cancelar), reseta os dados do formulário
      setFormData({ username: user.username, email: user.email });
    }
    setIsEditing(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${baseURL}/users/${user.id}`, formData);
      onUserUpdate(response.data); // Atualiza o estado global do usuário no App.jsx
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
        await axios.delete(`${baseURL}/users`);
        showAlert("success", "Sua conta foi excluída com sucesso.");
        onLogout(); // Chama a função de logout do App.jsx
      } catch (err) {
        console.error("Erro ao deletar conta:", err);
        showAlert("error", "Não foi possível excluir a conta.");
      }
    }
  };

  return (
    <div className="account-page">
      <header className="account-header">
        <h1>Minha Conta</h1>
        <p>Gerencie suas informações pessoais e de segurança.</p>
      </header>

      <form onSubmit={handleSubmit} className="account-layout">
        <aside className="account-sidebar">
          <div className="profile-card">
            <div className="profile-avatar">
              {user?.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" /> : <span>{getInitials(user?.username)}</span>}
            </div>
            <h2 className="profile-name">{user.username}</h2>
            <p className="profile-email">{user?.email}</p>
            <div className="profile-actions">
              {isEditing ? (
                <>
                  <button type="submit" className="btn-primary">Salvar Alterações</button>
                  <button type="button" className="btn-secondary" onClick={handleEditToggle}>Cancelar</button>
                </>
              ) : (
                <button type="button" className="btn-primary" onClick={handleEditToggle}>Editar Perfil</button>
              )}
            </div>
          </div>
        </aside>

        <main className="account-main">
          <div className="details-card">
            <div className="details-card__header"><h3>Detalhes da Conta</h3></div>
            <div className="details-card__body">
              <div className="info-row">
                <div className="info-row__label"><Icons.User size={16} /><span>Nome de Usuário</span></div>
                {isEditing ? (
                  <input type="text" name="username" className="form-input" value={formData.username} onChange={handleInputChange} />
                ) : (
                  <span className="info-row__value">{user?.username}</span>
                )}
              </div>
              <div className="info-row">
                <div className="info-row__label"><Icons.Model size={16} /><span>Email</span></div>
                {isEditing ? (
                  <input type="email" name="email" className="form-input" value={formData.email} onChange={handleInputChange} />
                ) : (
                  <span className="info-row__value">{user?.email}</span>
                )}
              </div>
              <div className="info-row">
                <div className="info-row__label"><Icons.Calendar size={16} /><span>Membro desde</span></div>
                <span className="info-row__value">{formatDate(user?.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="details-card">
            <div className="details-card__header"><h3>Segurança</h3></div>
            <div className="details-card__body">
              <div className="info-row--action">
                <span>Altere sua senha para manter sua conta segura.</span>
                <button type="button" className="btn-secondary">Alterar Senha</button>
              </div>
            </div>
          </div>

          <div className="details-card danger-zone">
            <div className="details-card__header"><h3>Zona de Perigo</h3></div>
            <div className="details-card__body">
              <div className="info-row--action">
                <div>
                  <strong>Excluir esta conta</strong>
                  <p>Uma vez que você exclui sua conta, não há volta. Tenha certeza.</p>
                </div>
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