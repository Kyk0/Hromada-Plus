import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/user";
import { fetchHromadas } from "../api/hromadas";

const RegisterPage = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        hromada: "",
        hromada_id: null,
    });

    const [hromadas, setHromadas] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchHromadas()
            .then(setHromadas)
            .catch(() => setError("Не вдалося отримати список громад"));
    }, []);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (name === "hromada") {
            const results = hromadas.filter((h) =>
                h.name.toLowerCase().includes(value.toLowerCase())
            );
            setFiltered(results.slice(0, 5));
        }
    };

    const handleSelectHromada = (hromada) => {
        setForm((prev) => ({
            ...prev,
            hromada: hromada.name,
            hromada_id: hromada.id,
        }));
        setFiltered([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const { name, surname, email, password, hromada_id } = form;
        try {
            await registerUser({ name, surname, email, password, hromada_id });
            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 to-teal-300 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 sm:p-8">
                <h2 className="text-3xl font-bold text-center text-teal-700 mb-6">Реєстрація</h2>

                {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Імʼя"
                            value={form.name}
                            onChange={handleInput}
                            className="w-1/2 px-3 py-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            name="surname"
                            placeholder="Прізвище"
                            value={form.surname}
                            onChange={handleInput}
                            className="w-1/2 px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    <input
                        type="email"
                        name="email"
                        placeholder="Електронна пошта"
                        value={form.email}
                        onChange={handleInput}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={form.password}
                        onChange={handleInput}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />

                    <div className="relative">
                        <input
                            type="text"
                            name="hromada"
                            placeholder="Введіть назву громади"
                            value={form.hromada}
                            onChange={handleInput}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                        {filtered.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-auto shadow">
                                {filtered.map((h) => (
                                    <li
                                        key={h.id}
                                        onClick={() => handleSelectHromada(h)}
                                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    >
                                        {h.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded transition"
                    >
                        Зареєструватися
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Вже маєте акаунт?{" "}
                    <Link to="/login" className="text-teal-600 hover:underline">
                        Увійти
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;