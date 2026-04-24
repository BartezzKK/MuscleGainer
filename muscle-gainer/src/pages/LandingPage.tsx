import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';

const LandingPage = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
                💪 Muscle Gainer
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#aaa', maxWidth: '600px', margin: '0 auto 2rem' }}>
                Zarządzaj swoimi treningami, śledź postępy i osiągaj cele siłowe.
            </p>

            {isAuthenticated ? (
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/workouts">
                        <button style={{ padding: '0.75em 2em', fontSize: '1.1rem', background: '#646cff', color: 'white', border: 'none', borderRadius: '8px' }}>
                            Moje treningi
                        </button>
                    </Link>
                    <Link to="/dashboard">
                        <button style={{ padding: '0.75em 2em', fontSize: '1.1rem' }}>
                            Dashboard
                        </button>
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/register">
                        <button style={{ padding: '0.75em 2em', fontSize: '1.1rem', background: '#646cff', color: 'white', border: 'none', borderRadius: '8px' }}>
                            Rozpocznij za darmo
                        </button>
                    </Link>
                    <Link to="/login">
                        <button style={{ padding: '0.75em 2em', fontSize: '1.1rem' }}>
                            Zaloguj się
                        </button>
                    </Link>
                </div>
            )}

            <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <FeatureCard
                    icon="🏋️"
                    title="Zapisuj treningi"
                    description="Twórz treningi, dodawaj ćwiczenia i serie z wagą i powtórzeniami."
                />
                <FeatureCard
                    icon="📊"
                    title="Śledź postępy"
                    description="Monitoruj swoje wyniki i obserwuj jak rośnie Twoja siła."
                />
                <FeatureCard
                    icon="🔒"
                    title="Twoje dane"
                    description="Bezpieczne konto z autoryzacją JWT. Tylko Ty widzisz swoje treningi."
                />
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
    <div style={{
        border: '1px solid #333',
        borderRadius: '12px',
        padding: '1.5rem',
        width: '220px',
        textAlign: 'center',
    }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{icon}</div>
        <h3 style={{ margin: '0 0 0.5rem' }}>{title}</h3>
        <p style={{ color: '#aaa', margin: 0, fontSize: '0.9rem' }}>{description}</p>
    </div>
);

export default LandingPage;
