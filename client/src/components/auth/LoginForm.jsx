import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { SocialLogin } from './SocialLogin';

const FormInput = ({ label, type, value, onChange }) => (
    <div className="space-y-1">
        <label className="text-sm font-medium">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            required
        />
    </div>
);

const SubmitButton = ({ loading }) => (
    <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
    >
        {loading ? 'Logging in...' : 'Login'}
    </button>
);

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto p-6 border rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <FormInput label="Email" type="email" value={email} onChange={setEmail} />
            <FormInput label="Password" type="password" value={password} onChange={setPassword} />
            <SubmitButton loading={loading} />
            <SocialLogin />
        </form>
    );
}
