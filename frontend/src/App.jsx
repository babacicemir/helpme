import Navbar from "./components/common/Navbar"
import Footer from "./components/common/Footer"
import AppRoutes from "./routes/Approutes"

function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />

            <main className="flex-grow-1">
                <AppRoutes />
            </main>

            <Footer />
        </div>
    )
}

export default App