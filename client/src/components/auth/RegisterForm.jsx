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

const SubmitBtn = ({ loading }) => (
    <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
    >
        {loading ? 'Signing up...' : 'Register'}
    </button>
);

export function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleRegister} className="space-y-4 max-w-sm mx-auto p-6 border rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-center">Create Account</h2>
            <FormInput label="Name" type="text" value={name} onChange={setName} />
            <FormInput label="Email" type="email" value={email} onChange={setEmail} />
            <FormInput label="Password" type="password" value={password} onChange={setPassword} />
            <SubmitBtn loading={loading} />
            <SocialLogin />
        </form>
    );
}
