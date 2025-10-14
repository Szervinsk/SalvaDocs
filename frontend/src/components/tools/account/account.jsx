import { Icons } from "../../../constants/icons";
import "./account.css"; // Importe o novo arquivo CSS

function Account({ user }) {
  // Função para pegar as iniciais do nome do usuário para o avatar
  const getInitials = (name = "") => {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  };

  // Função para formatar a data
  const formatDate = (dateString) => {
    if (!dateString) return "Não disponível";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="account-page">
      <header className="account-header">
        <h1>Minha Conta</h1>
        <p>Gerencie suas informações pessoais e de segurança.</p>
      </header>

      <div className="account-layout">
        {/* Coluna da Esquerda: Perfil Rápido */}
        <aside className="account-sidebar">
          <div className="profile-card">
            <div className="profile-avatar">
              {/* Se o usuário tiver uma imagem, exiba. Senão, mostre as iniciais. */}
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar do usuário" />
              ) : (
                <span>{getInitials(user?.username)}</span>
              )}
            </div>
            <h2 className="profile-name">{user.username || "Usuário"}</h2>
            <p className="profile-email">{user?.email || "email@exemplo.com"}</p>
            <div className="profile-actions">
              <button className="btn-primary">Editar Perfil</button>
              <button className="btn-primary">Alterar Foto</button>
            </div>
          </div>
        </aside>

        {/* Coluna da Direita: Detalhes */}
        <main className="account-main">
          <div className="details-card">
            <div className="details-card__header">
              <h3>Detalhes da Conta</h3>
            </div>
            <div className="details-card__body">
              <div className="info-row">
                <div className="info-row__label">
                  <Icons.People size={16} />
                  <span>Nome de Usuário</span>
                </div>
                <span className="info-row__value">{user?.username || "-"}</span>
              </div>
              <div className="info-row">
                <div className="info-row__label">
                  <Icons.Model size={16} /> {/* Reutilizando ícone de e-mail */}
                  <span>Email</span>
                </div>
                <span className="info-row__value">{user?.email || "-"}</span>
              </div>
              <div className="info-row">
                <div className="info-row__label">
                  <Icons.Calendar size={16} />
                  <span>Membro desde</span>
                </div>
                <span className="info-row__value">{formatDate(user?.createdAt)}</span>
              </div>
              <div className="info-row">
                <div className="info-row__label">
                  <Icons.Check size={16} /> {/* Ícone para plano/status */}
                  <span>Plano Atual</span>
                </div>
                <span className="info-row__value tag-plan">{user?.plan || "Básico"}</span>
              </div>
            </div>
          </div>

          <div className="details-card">
            <div className="details-card__header">
              <h3>Segurança</h3>
            </div>
            <div className="details-card__body">
               <div className="info-row">
                <div className="info-row__label">
                  <Icons.Clock size={16} />
                  <span>Último Login</span>
                </div>
                <span className="info-row__value">{formatDate(user?.lastLogin)}</span>
              </div>
              <div className="info-row--action">
                <span>Altere sua senha para manter sua conta segura.</span>
                <button className="btn-primary">Alterar Senha</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Account;