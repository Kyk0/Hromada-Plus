import Navbar from "../components/Navbar";

const HomePage = () => {
    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-3xl font-bold text-green-700">Головна сторінка</h1>
            </div>
        </>
    );
};

export default HomePage;