document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!token || !usuario) { window.location.href = 'login.html'; return; }
    if (usuario.rol !== 'admin') { document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none'); }
    document.getElementById('welcome-message').textContent = `Bienvenido, ${usuario.nombre}`;
    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = 'login.html';
    });
    const contentArea = document.getElementById('content-area');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            loadSection(e.target.getAttribute('data-section'), contentArea);
        });
    });
    loadSection('inicio', contentArea);
});

async function loadSection(section, container) {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    container.innerHTML = ''; 

    switch (true) { 
        case section === 'inicio':
            container.innerHTML = renderInicio();
            try {
                const response = await fetch('http://localhost:5000/api/dashboard/summary');
                if (!response.ok) throw new Error('API no encontrada o con errores.');
                const data = await response.json();
                document.getElementById('stat-ordenes').textContent = data.ordenesAbiertas;
                document.getElementById('stat-turnos').textContent = data.turnosHoy;
                document.getElementById('stat-stock').textContent = data.itemsBajoStock;
                const ctx = document.getElementById('myChart').getContext('2d');
                new Chart(ctx, { type: 'bar', data: { labels: ['Órdenes Abiertas', 'Turnos de Hoy', 'Alertas de Stock'], datasets: [{ label: 'Cantidad', data: [data.ordenesAbiertas, data.turnosHoy, data.itemsBajoStock], backgroundColor: ['rgba(255, 159, 64, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)'], borderColor: ['rgb(255, 159, 64)', 'rgb(54, 162, 235)', 'rgb(255, 99, 132)'], borderWidth: 1 }] }, options: { scales: { y: { beginAtZero: true, suggestedMax: 10 } }, plugins: { legend: { display: false } } } });
            } catch (error) {
                console.error("Error al cargar el dashboard:", error);
                container.innerHTML = `<p style="color: red;">No se pudo cargar el dashboard.</p>`;
            }
            break;

        case section === 'servicios':
            container.innerHTML = `<h2>Gestión de Servicios</h2><button id="add-service-btn" class="btn-submit" style="width: auto; margin-bottom: 20px;">Añadir Nuevo Servicio</button><div id="service-list-container"></div>`;
            container.appendChild(modalContainer);
            const serviceListContainer = document.getElementById('service-list-container');
            const loadServices = async () => {
                const response = await fetch('http://localhost:5000/api/servicios');
                const servicios = await response.json();
                let html = '<p>No hay servicios registrados.</p>';
                if (servicios.length > 0) {
                    html = `<table class="styled-table"><thead><tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Acciones</th></tr></thead><tbody>`;
                    servicios.forEach(s => { html += `<tr><td>${s.nombre}</td><td>${s.categoria}</td><td>$${s.precio}</td><td><button class="btn-edit" data-id="${s.id}">Editar</button><button class="btn-delete" data-id="${s.id}">Eliminar</button></td></tr>`; });
                    html += '</tbody></table>';
                }
                serviceListContainer.innerHTML = html;
            };
            const handleServiceForm = (data = {}) => {
                modalContainer.innerHTML = renderServiceForm(data);
                const modal = document.getElementById('service-modal');
                modal.style.display = 'block';
                modal.querySelector('.close-button').onclick = () => modal.style.display = 'none';
                modal.querySelector('#form-servicio').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const formData = Object.fromEntries(new FormData(e.target).entries());
                    const url = formData.id ? `http://localhost:5000/api/servicios/${formData.id}` : 'http://localhost:5000/api/servicios';
                    await fetch(url, { method: formData.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
                    modal.style.display = 'none';
                    loadServices();
                });
            };
            document.getElementById('add-service-btn').addEventListener('click', () => handleServiceForm());
            serviceListContainer.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                if (e.target.classList.contains('btn-delete') && confirm('¿Estás seguro?')) {
                    await fetch(`http://localhost:5000/api/servicios/${id}`, { method: 'DELETE' });
                    loadServices();
                }
                if (e.target.classList.contains('btn-edit')) {
                    const res = await fetch(`http://localhost:5000/api/servicios/${id}`);
                    const serviceToEdit = await res.json();
                    if (serviceToEdit) handleServiceForm(serviceToEdit);
                }
            });
            loadServices();
            break;

        case section === 'clientes':
            container.innerHTML = renderClientes(); 
            container.appendChild(modalContainer);
            const clientListContainer = document.getElementById('client-list-container');
            const searchInputClientes = document.getElementById('search-input-clientes');
            let allClients = []; 

            const renderClientTable = (clientes) => {
                let html = '<p>No se encontraron clientes.</p>';
                if (clientes.length > 0) {
                    html = `<table class="styled-table"><thead><tr><th>Nombre</th><th>Apellido</th><th>Teléfono</th><th>Email</th><th>Dirección</th><th>Acciones</th></tr></thead><tbody>`;
                    clientes.forEach(c => {
                        html += `<tr><td>${c.nombre}</td><td>${c.apellido}</td><td>${c.telefono || 'N/A'}</td><td>${c.email || 'N/A'}</td><td>${c.direccion || 'N/A'}</td><td><button class="btn-edit" data-id="${c.id}">Editar</button><button class="btn-delete" data-id="${c.id}">Eliminar</button><button class="btn-view-account" data-id="${c.id}">Ver Cuenta</button></td></tr>`;
                    });
                    html += '</tbody></table>';
                }
                clientListContainer.innerHTML = html;
            };
            const filterAndSearchClients = () => {
                const searchTerm = searchInputClientes.value.toLowerCase();
                const filteredClients = allClients.filter(cliente => {
                    return searchTerm === '' ||
                        cliente.nombre.toLowerCase().includes(searchTerm) ||
                        cliente.apellido.toLowerCase().includes(searchTerm) ||
                        (cliente.telefono && cliente.telefono.toLowerCase().includes(searchTerm)) ||
                        (cliente.email && cliente.email.toLowerCase().includes(searchTerm));
                });
                renderClientTable(filteredClients);
            };
            const loadClients = async () => {
                const response = await fetch('http://localhost:5000/api/clientes');
                allClients = await response.json();
                renderClientTable(allClients);
            };
            const handleClientForm = (clientData = {}) => {
                modalContainer.innerHTML = renderClientForm(clientData);
                const modal = document.getElementById('client-modal');
                modal.style.display = 'block';
                modal.querySelector('.close-button').onclick = () => modal.style.display = 'none';
                modal.querySelector('#form-cliente').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const data = Object.fromEntries(new FormData(e.target).entries());
                    const url = data.id ? `http://localhost:5000/api/clientes/${data.id}` : 'http://localhost:5000/api/clientes';
                    await fetch(url, { method: data.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                    modal.style.display = 'none';
                    loadClients();
                });
            };
            document.getElementById('add-client-btn').addEventListener('click', () => handleClientForm());
            searchInputClientes.addEventListener('input', filterAndSearchClients);
            clientListContainer.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                if (e.target.classList.contains('btn-delete') && confirm('¿Estás seguro?')) {
                    const response = await fetch(`http://localhost:5000/api/clientes/${id}`, { method: 'DELETE' });
                    if (!response.ok) { const err = await response.json(); alert(err.msg); }
                    loadClients();
                }
                if (e.target.classList.contains('btn-edit')) {
                    const res = await fetch(`http://localhost:5000/api/clientes/${id}`);
                    const clientToEdit = await res.json();
                    if (clientToEdit) handleClientForm(clientToEdit);
                }
                if (e.target.classList.contains('btn-view-account')) {
                    loadSection(`cuenta-cliente/${id}`, container);
                }
            });
            loadClients();
            break;

        case section === 'vehiculos':
            container.innerHTML = renderVehiculos();
            container.appendChild(modalContainer);
            const vehicleListContainer = document.getElementById('vehicle-list-container');
            const searchInputVehiculos = document.getElementById('search-input-vehiculos');
            let allVehicles = [];

            const renderVehicleTable = (vehiculos) => {
                let html = '<p>No hay vehículos registrados.</p>';
                if (vehiculos.length > 0) {
                    html = `<table class="styled-table"><thead><tr><th>Patente</th><th>Marca</th><th>Modelo</th><th>Año</th><th>Kilometraje</th><th>Propietario</th><th>Acciones</th></tr></thead><tbody>`;
                    vehiculos.forEach(v => {
                        html += `<tr><td>${v.patente}</td><td>${v.marca}</td><td>${v.modelo}</td><td>${v.ano || 'N/A'}</td><td>${v.km || 'N/A'}</td><td>${v.cliente_apellido}, ${v.cliente_nombre}</td><td><button class="btn-edit" data-id="${v.id}">Editar</button><button class="btn-delete" data-id="${v.id}">Eliminar</button></td></tr>`;
                    });
                    html += '</tbody></table>';
                }
                vehicleListContainer.innerHTML = html;
            };
            const filterAndSearchVehicles = () => {
                const searchTerm = searchInputVehiculos.value.toLowerCase();
                const filteredVehicles = allVehicles.filter(v => {
                    return searchTerm === '' ||
                        v.patente.toLowerCase().includes(searchTerm) ||
                        v.marca.toLowerCase().includes(searchTerm) ||
                        v.modelo.toLowerCase().includes(searchTerm) ||
                        v.cliente_nombre.toLowerCase().includes(searchTerm) ||
                        v.cliente_apellido.toLowerCase().includes(searchTerm);
                });
                renderVehicleTable(filteredVehicles);
            };
            const loadVehicles = async () => {
                const response = await fetch('http://localhost:5000/api/vehiculos');
                allVehicles = await response.json();
                renderVehicleTable(allVehicles);
            };
            const handleVehicleForm = async (vehicleData = {}) => {
                const clientesRes = await fetch('http://localhost:5000/api/clientes');
                const clientes = await clientesRes.json();
                modalContainer.innerHTML = renderVehicleForm(vehicleData, clientes);
                const modal = document.getElementById('vehicle-modal');
                modal.style.display = 'block';
                modal.querySelector('.close-button').onclick = () => modal.style.display = 'none';
                modal.querySelector('#form-vehiculo').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const data = Object.fromEntries(new FormData(e.target).entries());
                    const url = data.id ? `http://localhost:5000/api/vehiculos/${data.id}` : 'http://localhost:5000/api/vehiculos';
                    await fetch(url, { method: data.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                    modal.style.display = 'none';
                    loadVehicles();
                });
            };
            document.getElementById('add-vehicle-btn').addEventListener('click', () => handleVehicleForm());
            searchInputVehiculos.addEventListener('input', filterAndSearchVehicles);
            vehicleListContainer.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                if (e.target.classList.contains('btn-delete') && confirm('¿Estás seguro?')) {
                    const response = await fetch(`http://localhost:5000/api/vehiculos/${id}`, { method: 'DELETE' });
                    if (!response.ok) { const err = await response.json(); alert(err.msg); }
                    loadVehicles();
                }
                if (e.target.classList.contains('btn-edit')) {
                    const res = await fetch(`http://localhost:5000/api/vehiculos/${id}`);
                    const vehicleToEdit = await res.json();
                    if (vehicleToEdit) handleVehicleForm(vehicleToEdit);
                }
            });
            loadVehicles();
            break;

        case section === 'tareas':
            container.innerHTML = renderOrdenes();
            container.appendChild(modalContainer);
            const ordersTableContainer = document.getElementById('orders-table-container');
            const searchInputTareas = document.getElementById('search-input-tareas');
            const filterButtons = document.querySelector('.filter-buttons');
            let allOrders = [];

            const renderTable = (ordenes) => {
                if (!ordenes || !ordenes.length) {
                    ordersTableContainer.innerHTML = '<p>No se encontraron órdenes de trabajo.</p>';
                    return;
                }
                let tableHTML = `<table class="styled-table expandable-table"><thead><tr><th>Vehículo</th><th>Propietario</th><th>Patente</th><th>Estado</th></tr></thead><tbody>`;
                ordenes.forEach(orden => {
                    const fecha = new Date(orden.fecha_creacion).toLocaleDateString('es-AR');
                    tableHTML += `
                        <tr class="main-row" data-target="details-${orden.id}">
                            <td>${orden.marca} ${orden.modelo}</td>
                            <td>${orden.cliente_apellido}, ${orden.cliente_nombre}</td>
                            <td>${orden.patente}</td>
                            <td><span class="status-badge" data-status="${orden.estado}">${orden.estado}</span></td>
                        </tr>
                        <tr class="details-row" id="details-${orden.id}">
                            <td colspan="4">
                                <div class="details-card">
                                    <div class="details-info">
                                        <p><strong>Problema:</strong> ${orden.descripcion_problema}</p>
                                        <p><strong>Tiempo Estimado:</strong> ${orden.tiempo_estimado || 'N/A'}</p>
                                        <p><strong>Técnico:</strong> ${orden.tecnico_nombre || 'Sin asignar'}</p>
                                        <p><strong>Costo Total:</strong> $${orden.costo_total ? Number(orden.costo_total).toFixed(2) : '0.00'}</p>
                                        <p><small>Fecha de Ingreso: ${fecha}</small></p>
                                    </div>
                                    <div class="card-actions">
                                        <button class="btn-edit" data-id="${orden.id}">Editar</button>
                                        <button class="btn-delete" data-id="${orden.id}">Eliminar</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `;
                });
                tableHTML += `</tbody></table>`;
                ordersTableContainer.innerHTML = tableHTML;
            };

            const filterAndSearch = () => {
                const searchTerm = searchInputTareas.value.toLowerCase();
                const activeStatus = filterButtons.querySelector('.active').dataset.status;
                const filteredOrders = allOrders.filter(orden => (searchTerm === '' || orden.patente.toLowerCase().includes(searchTerm) || orden.cliente_nombre.toLowerCase().includes(searchTerm) || orden.cliente_apellido.toLowerCase().includes(searchTerm) || orden.marca.toLowerCase().includes(searchTerm)) && (activeStatus === 'todas' || orden.estado === activeStatus));
                renderTable(filteredOrders);
            };

            const loadOrders = async () => {
                const response = await fetch('http://localhost:5000/api/ordenes');
                allOrders = await response.json();
                filterAndSearch();
            };

            const handleOrderForm = async (orderData = {}) => {
                try {
                    const [clientesRes, vehiculosRes, tecnicosRes] = await Promise.all([fetch('http://localhost:5000/api/clientes'), fetch('http://localhost:5000/api/vehiculos'), fetch('http://localhost:5000/api/usuarios/tecnicos')]);
                    if (!clientesRes.ok || !vehiculosRes.ok || !tecnicosRes.ok) throw new Error("Fallo al cargar datos para el formulario");
                    const clientes = await clientesRes.json() || [];
                    const vehiculos = await vehiculosRes.json() || [];
                    const tecnicos = await tecnicosRes.json() || [];
                    modalContainer.innerHTML = renderOrderForm(orderData, clientes, vehiculos, tecnicos);
                    const modal = document.getElementById('order-modal'), form = document.getElementById('form-orden');
                    modal.style.display = 'block';
                    modal.querySelector('.close-button').onclick = () => modal.style.display = 'none';
                    const clienteSelect = document.getElementById('orden-cliente');
                    const vehiculoSelect = document.getElementById('orden-vehiculo');
                    if (orderData.cliente_id) {
                        const vehiculosDelCliente = vehiculos.filter(v => v.cliente_id == orderData.cliente_id);
                        vehiculoSelect.innerHTML = '<option value="">Seleccione un vehículo</option>';
                        vehiculosDelCliente.forEach(v => {
                            const selected = v.id == orderData.vehiculo_id ? 'selected' : '';
                            vehiculoSelect.innerHTML += `<option value="${v.id}" ${selected}>${v.marca} ${v.modelo} (${v.patente})</option>`;
                        });
                    }
                    clienteSelect.addEventListener('change', () => {
                        const vehiculosDelCliente = vehiculos.filter(v => v.cliente_id == clienteSelect.value);
                        vehiculoSelect.innerHTML = '<option value="">Seleccione un vehículo</option>';
                        vehiculosDelCliente.forEach(v => { vehiculoSelect.innerHTML += `<option value="${v.id}">${v.marca} ${v.modelo} (${v.patente})</option>`; });
                    });
                    form.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const data = Object.fromEntries(new FormData(form).entries());
                        const url = data.id ? `http://localhost:5000/api/ordenes/${data.id}` : 'http://localhost:5000/api/ordenes';
                        await fetch(url, { method: data.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                        modal.style.display = 'none';
                        loadOrders();
                    });
                } catch (error) {
                    console.error("Error al preparar formulario de orden:", error);
                    alert("Hubo un error al cargar los datos necesarios para el formulario. Revisa la consola.");
                }
            };
            
            searchInputTareas.addEventListener('input', filterAndSearch);
            filterButtons.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    filterButtons.querySelector('.active').classList.remove('active');
                    e.target.classList.add('active');
                    filterAndSearch();
                }
            });
            document.getElementById('add-order-btn').addEventListener('click', () => handleOrderForm());
            ordersTableContainer.addEventListener('click', async (e) => {
                const target = e.target;
                const id = target.dataset.id;
                if (target.classList.contains('btn-delete') && confirm('¿Estás seguro?')) {
                    await fetch(`http://localhost:5000/api/ordenes/${id}`, { method: 'DELETE' });
                    loadOrders();
                }
                if (target.classList.contains('btn-edit')) {
                    try {
                        const orderToEdit = allOrders.find(o => o.id == id);
                        if (orderToEdit) await handleOrderForm(orderToEdit);
                    } catch (error) {
                        console.error("Error al preparar formulario de edición:", error);
                        alert("Hubo un error al cargar los datos para editar.");
                    }
                }
                const mainRow = target.closest('.main-row');
                if (mainRow && !target.closest('.card-actions')) {
                    const detailsRow = document.getElementById(mainRow.dataset.target);
                    if (detailsRow) {
                        document.querySelectorAll('.details-visible').forEach(openRow => { if (openRow !== detailsRow) openRow.classList.remove('details-visible'); });
                        detailsRow.classList.toggle('details-visible');
                    }
                }
            });

            loadOrders();
            break;

        case section === 'turnos':
            container.innerHTML = renderTurnos();
            container.appendChild(modalContainer);
            const formTurno = document.getElementById('form-turno');
            const clienteSelectTurno = document.getElementById('turno-cliente');
            const vehiculoSelectTurno = document.getElementById('turno-vehiculo');
            const mensajeDiv = document.getElementById('turno-mensaje');
            const listaTurnosContainer = document.getElementById('lista-turnos-container');
            const loadTurnos = async () => {
                try {
                    const response = await fetch('http://localhost:5000/api/turnos');
                    const turnos = await response.json();
                    if (turnos.length === 0) { listaTurnosContainer.innerHTML = '<p>No hay próximos turnos.</p>'; return; }
                    let turnosHTML = `<table class="styled-table"><thead><tr><th>Fecha/Hora</th><th>Cliente</th><th>Vehículo</th><th>Servicio</th><th>Estado</th><th>Comentarios</th><th>Acciones</th></tr></thead><tbody>`;
                    turnos.forEach(turno => {
                        const fecha = new Date(turno.fecha_turno).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
                        turnosHTML += `<tr><td>${fecha}hs</td><td>${turno.cliente_apellido}, ${turno.cliente_nombre}</td><td>${turno.marca} ${turno.modelo} (${turno.patente})</td><td>${turno.servicio_solicitado}</td><td><span class="status-badge" data-status="${turno.estado}">${turno.estado}</span></td><td>${turno.comentarios || 'N/A'}</td><td><button class="btn-edit" data-id="${turno.id}">Editar</button><button class="btn-delete" data-id="${turno.id}">Eliminar</button></td></tr>`;
                    });
                    turnosHTML += '</tbody></table>';
                    listaTurnosContainer.innerHTML = turnosHTML;
                } catch (error) { listaTurnosContainer.innerHTML = `<p style="color: red;">Error al cargar turnos.</p>`; }
            };
            const handleTurnoForm = (turnoData) => {
                modalContainer.innerHTML = renderTurnoForm(turnoData);
                const modal = document.getElementById('turno-modal');
                const formEdit = document.getElementById('form-edit-turno');
                modal.style.display = 'block';
                modal.querySelector('.close-button').onclick = () => modal.style.display = 'none';
                formEdit.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const data = Object.fromEntries(new FormData(formEdit).entries());
                    try {
                        await fetch(`http://localhost:5000/api/turnos/${data.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                        modal.style.display = 'none';
                        loadTurnos();
                    } catch (error) { alert(error.message); }
                });
            };
            fetch('http://localhost:5000/api/clientes').then(res => res.json()).then(clientes => {
                clienteSelectTurno.innerHTML = '<option value="">Seleccione un cliente</option>';
                (clientes || []).forEach(cliente => { clienteSelectTurno.innerHTML += `<option value="${cliente.id}">${cliente.apellido}, ${cliente.nombre}</option>`; });
            });
            clienteSelectTurno.addEventListener('change', () => {
                fetch('http://localhost:5000/api/vehiculos').then(res => res.json()).then(vehiculos => {
                    const vehiculosDelCliente = (vehiculos || []).filter(v => v.cliente_id === parseInt(clienteSelectTurno.value));
                    vehiculoSelectTurno.innerHTML = '<option value="">Seleccione un vehículo</option>';
                    if (vehiculosDelCliente.length > 0) {
                        vehiculosDelCliente.forEach(v => { vehiculoSelectTurno.innerHTML += `<option value="${v.id}">${v.marca} ${v.modelo} (${v.patente})</option>`; });
                    } else { vehiculoSelectTurno.innerHTML = '<option value="">Este cliente no tiene vehículos</option>'; }
                });
            });
            formTurno.addEventListener('submit', async (e) => {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(formTurno).entries());
                try {
                    await fetch('http://localhost:5000/api/turnos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                    mensajeDiv.innerHTML = `<p style="color: green;">Turno agendado con éxito</p>`;
                    formTurno.reset();
                    loadTurnos();
                } catch (error) { mensajeDiv.innerHTML = `<p style="color: red;">${error.message}</p>`; }
            });
            listaTurnosContainer.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                if (e.target.classList.contains('btn-delete') && confirm('¿Estás seguro?')) {
                    await fetch(`http://localhost:5000/api/turnos/${id}`, { method: 'DELETE' });
                    loadTurnos();
                }
                if (e.target.classList.contains('btn-edit')) {
                    try {
                        const response = await fetch(`http://localhost:5000/api/turnos/${id}`);
                        const turnoToEdit = await response.json();
                        if (turnoToEdit) handleTurnoForm(turnoToEdit);
                    } catch (error) { alert('No se pudieron cargar los datos para editar.'); }
                }
            });
            loadTurnos();
            break;

        case section === 'inventario':
            container.innerHTML = `<h2>Control de Inventario</h2><button id="add-inventory-btn" class="btn-submit" style="width: auto; margin-bottom: 20px;">Añadir Nuevo Item</button><div id="inventory-list-container"></div>`;
            container.appendChild(modalContainer);
            const inventoryListContainer = document.getElementById('inventory-list-container');
            const loadInventory = async () => {
                const response = await fetch('http://localhost:5000/api/inventario');
                const items = await response.json();
                let html = '<p>No hay items.</p>';
                if (items.length > 0) {
                    html = `<table class="styled-table"><thead><tr><th>Nombre</th><th>Stock</th><th>Mínimo</th><th>Descripción</th><th>Acciones</th></tr></thead><tbody>`;
                    items.forEach(item => {
                        const lowStockClass = item.cantidad_stock <= item.stock_minimo ? 'low-stock-row' : '';
                        html += `<tr class="${lowStockClass}"><td>${item.nombre}</td><td>${item.cantidad_stock}</td><td>${item.stock_minimo}</td><td>${item.descripcion || 'N/A'}</td><td><button class="btn-edit" data-id="${item.id}">Editar</button><button class="btn-delete" data-id="${item.id}">Eliminar</button></td></tr>`;
                    });
                    html += '</tbody></table>';
                }
                inventoryListContainer.innerHTML = html;
            };
            const handleInventoryForm = (itemData = {}) => {
                modalContainer.innerHTML = renderInventoryForm(itemData);
                const modal = document.getElementById('inventory-modal');
                modal.style.display = 'block';
                modal.querySelector('.close-button').onclick = () => modal.style.display = 'none';
                modal.querySelector('#form-inventario').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const data = Object.fromEntries(new FormData(e.target).entries());
                    const url = data.id ? `/api/inventario/${data.id}` : '/api/inventario';
                    await fetch('http://localhost:5000' + url, { method: data.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                    modal.style.display = 'none';
                    loadInventory();
                });
            };
            document.getElementById('add-inventory-btn').addEventListener('click', () => handleInventoryForm());
            inventoryListContainer.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                if (e.target.classList.contains('btn-delete') && confirm('¿Estás seguro?')) {
                    await fetch(`http://localhost:5000/api/inventario/${id}`, { method: 'DELETE' });
                    loadInventory();
                }
                if (e.target.classList.contains('btn-edit')) {
                    const res = await fetch(`http://localhost:5000/api/inventario/${id}`);
                    const itemToEdit = await res.json();
                    if (itemToEdit) handleInventoryForm(itemToEdit);
                }
            });
            loadInventory();
            break;

        case section === 'reportes':
            container.innerHTML = renderReportes();
            try {
                const response = await fetch('http://localhost:5000/api/reportes/trabajos-por-tecnico');
                const data = await response.json();
                const reportContent = document.getElementById('report-content');
                let reportHTML = '<p>No hay datos.</p>';
                if (data.length > 0) {
                    reportHTML = `<table class="styled-table"><thead><tr><th>Técnico</th><th>Trabajos Finalizados</th></tr></thead><tbody>`;
                    data.forEach(row => { reportHTML += `<tr><td>${row.tecnico}</td><td>${row.trabajos_finalizados}</td></tr>`; });
                    reportHTML += `</tbody></table>`;
                }
                reportContent.innerHTML = reportHTML;
            } catch (error) { document.getElementById('report-content').innerHTML = `<p style="color: red;">${error.message}</p>`; }
            break;
            
        case section === 'personal':
            container.innerHTML = `<h2>Gestión de Personal</h2><button id="add-personal-btn" class="btn-submit" style="width: auto; margin-bottom: 20px;">Añadir Nuevo Empleado</button><div id="personal-list-container"></div>`;
            container.appendChild(modalContainer);
            const personalListContainer = document.getElementById('personal-list-container');
            const loadPersonal = async () => {
                const response = await fetch('http://localhost:5000/api/usuarios');
                const personal = await response.json();
                let html = '<p>No hay personal.</p>';
                if (personal.length > 0) {
                    html = `<table class="styled-table"><thead><tr><th>Nombre Completo</th><th>Usuario</th><th>Rol</th><th>Acciones</th></tr></thead><tbody>`;
                    personal.forEach(p => {
                        const buttons = p.rol !== 'admin' ? `<button class="btn-edit" data-id="${p.id}">Editar</button><button class="btn-delete" data-id="${p.id}">Eliminar</button>` : '';
                        html += `<tr><td>${p.nombre_completo}</td><td>${p.usuario}</td><td>${p.rol}</td><td>${buttons}</td></tr>`;
                    });
                    html += '</tbody></table>';
                }
                personalListContainer.innerHTML = html;
            };
            const handlePersonalForm = (userData = {}) => {
                modalContainer.innerHTML = renderPersonalForm(userData);
                const modal = document.getElementById('personal-modal');
                modal.style.display = 'block';
                modal.querySelector('.close-button').onclick = () => modal.style.display = 'none';
                modal.querySelector('#form-personal').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const data = Object.fromEntries(new FormData(e.target).entries());
                    if (data.id && data.contrasena === '') delete data.contrasena;
                    const url = data.id ? `/api/usuarios/${data.id}` : '/api/usuarios';
                    await fetch('http://localhost:5000' + url, { method: data.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                    modal.style.display = 'none';
                    loadPersonal();
                });
            };
            document.getElementById('add-personal-btn').addEventListener('click', () => handlePersonalForm());
            personalListContainer.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                if (e.target.classList.contains('btn-delete') && confirm('¿Estás seguro?')) {
                    const response = await fetch(`http://localhost:5000/api/usuarios/${id}`, { method: 'DELETE' });
                    if (!response.ok) { const err = await response.json(); alert(err.msg); }
                    loadPersonal();
                }
                if (e.target.classList.contains('btn-edit')) {
                    const response = await fetch(`http://localhost:5000/api/usuarios/${id}`);
                    const userToEdit = await response.json();
                    if (userToEdit) handlePersonalForm(userToEdit);
                }
            });
            loadPersonal();
            break;
            
        case section.startsWith('cuenta-cliente/'):
            const clienteId = section.split('/')[1];
            container.innerHTML = renderCuentaCliente();
            
            const loadCuenta = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/cuentas/${clienteId}`);
                    if (!response.ok) throw new Error('No se pudo cargar la cuenta del cliente.');
                    const data = await response.json();
                    
                    document.getElementById('cuenta-cliente-nombre').textContent = `Cuenta Corriente de ${data.cliente.apellido}, ${data.cliente.nombre}`;
                    document.getElementById('cuenta-saldo-actual').textContent = `$ ${Number(data.saldoActual).toFixed(2)}`;

                    const historialContainer = document.getElementById('historial-container');
                    if (!data.historial || data.historial.length === 0) {
                        historialContainer.innerHTML = "<p>No hay movimientos para mostrar.</p>";
                    } else {
                        let historialHTML = `<table class="styled-table"><thead><tr><th>Fecha</th><th>Concepto</th><th>Debe</th><th>Haber</th><th>Saldo</th></tr></thead><tbody>`;
                        data.historial.forEach(mov => {
                            const fecha = new Date(mov.fecha).toLocaleDateString('es-AR');
                            historialHTML += `<tr><td>${fecha}</td><td>${mov.concepto}</td><td>${mov.debe ? `$ ${Number(mov.debe).toFixed(2)}` : '-'}</td><td>${mov.haber ? `$ ${Number(mov.haber).toFixed(2)}` : '-'}</td><td>$ ${Number(mov.saldo).toFixed(2)}</td></tr>`;
                        });
                        historialHTML += `</tbody></table>`;
                        historialContainer.innerHTML = historialHTML;
                    }
                } catch (error) {
                    console.error("Error al cargar la cuenta:", error);
                    container.innerHTML = `<p style="color:red;">Error al cargar la cuenta del cliente.</p>`;
                }
            };
            
            const formPago = document.getElementById('form-pago');
            formPago.addEventListener('submit', async (e) => {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(formPago).entries());
                data.cliente_id = clienteId;
                
                try {
                    const response = await fetch('http://localhost:5000/api/cuentas/pagos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    if (!response.ok) throw new Error('No se pudo registrar el pago.');
                    
                    document.getElementById('pago-mensaje').innerHTML = `<p style="color:green;">Pago registrado con éxito.</p>`;
                    formPago.reset();
                    loadCuenta();
                } catch (error) {
                    document.getElementById('pago-mensaje').innerHTML = `<p style="color:red;">${error.message}</p>`;
                }
            });

            loadCuenta();
            break;

        default:
            container.innerHTML = `<h2>Página no encontrada</h2>`;
    }
}