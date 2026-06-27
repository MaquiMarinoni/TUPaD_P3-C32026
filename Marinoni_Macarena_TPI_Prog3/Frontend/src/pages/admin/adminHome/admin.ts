import { validarSesion, cerrarSesion } from "../../../utils/authGuard";

// --- VALIDACIÓN DE ROL ---
validarSesion('ADMIN');

// --- SELECTORES DEL DOM ---
const contentArea = document.getElementById("admin-content") as HTMLElement;

// --- RENDERIZAR DASHBOARD ---
const renderizarDashboard = () => {
    if (!contentArea) return;
    contentArea.innerHTML = `
        <div class="dashboard-grid">
            <div class="dash-card bg-purple">
                <h3>Categorías</h3><p>📊</p>
                <button onclick="window.location.href='/src/pages/admin/categories/index.html'" class="nav-btn-dash">Gestionar</button>
            </div>
            <div class="dash-card bg-pink">
                <h3>Productos</h3><p>🍔</p>
                <button onclick="window.location.href='/src/pages/admin/products/index.html'" class="nav-btn-dash">Gestionar</button>
            </div>
            <div class="dash-card bg-cyan">
                <h3>Pedidos</h3><p>🛍️</p>
                <button onclick="window.location.href='/src/pages/admin/orders/index.html'" class="nav-btn-dash">Gestionar</button>
            </div>
            <div class="dash-card bg-green">
                <h3>Disponibles</h3><p>✅</p>
                <p style="font-size: 12px; margin-top:5px; font-weight:normal;">Productos activos</p>
            </div>
        </div>
    `;
};

// --- LISTENERS ---
document.getElementById("btn-logout")?.addEventListener("click", () => {
    cerrarSesion();
});

// Inicializar
renderizarDashboard();