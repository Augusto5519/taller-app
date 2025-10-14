// Archivo: client/js/ui.js 
function renderInicio() {
    return `
        <h2>Dashboard Principal</h2>
        <div class="dashboard-stats-grid">
            <div class="stat-card">
                <h3>Órdenes Abiertas</h3>
                <p id="stat-ordenes">...</p>
            </div>
            <div class="stat-card">
                <h3>Turnos para Hoy</h3>
                <p id="stat-turnos">...</p>
            </div>
            <div class="stat-card">
                <h3>Alertas de Stock</h3>
                <p id="stat-stock">...</p>
            </div>
        </div>
        <div class="chart-container">
            <h3>Resumen General</h3>
            <canvas id="myChart"></canvas>
        </div>
    `;
}

// Retorna el HTML para la sección de Servicios
function renderServicios() {
    // En un caso real, aquí harías un fetch a /api/servicios
    // y generarías la lista dinámicamente.
    return `
        <h2>Nuestros Servicios</h2>
        <div class="filters">
            <button data-category="all">Todos</button>
            <button data-category="mecánica">Mecánica</button>
            <button data-category="electricidad">Electricidad</button>
            <button data-category="neumáticos">Neumáticos</button>
        </div>
        <div class="service-list">
            <p>Aquí se mostrará la lista de servicios desde la base de datos.</p>
        </div>
    `;
}

// ... (función renderInicio)

// Retorna el HTML para la sección de Servicios
function renderServicios() {
    return `
        <h2>Gestión de Servicios</h2>
        <p>Aquí puedes ver y administrar los servicios que ofrece el taller.</p>
        <div class="filters">
            </div>
        <div id="service-list-container">
            <p>Cargando servicios...</p>
        </div>
    `;
}

// Retorna el HTML para la sección de Clientes
function renderClientes() {
    return `
        <h2>Gestión de Clientes</h2>
        <p>Administra la información de contacto y los vehículos de tus clientes.</p>
        <div id="client-list-container">
            <p>Cargando clientes...</p>
        </div>
    `;
}

// Retorna el HTML para la sección de Vehículos
function renderVehiculos() {
    return `
        <h2>Gestión de Vehículos</h2>
        <p>Consulta el listado completo de vehículos registrados en el sistema.</p>
        <div id="vehicle-list-container">
            <p>Cargando vehículos...</p>
        </div>
    `;
}

function renderOrdenes() {
    return `
        <h2>Dashboard de Órdenes de Trabajo</h2>
        <button id="add-order-btn" class="btn-submit" style="width: auto; margin-bottom: 20px;">Crear Nueva Orden</button>
        
        <div class="filter-controls">
            <input type="text" id="search-input" placeholder="Buscar por patente, cliente, marca...">
            <div class="filter-buttons">
                <button data-status="todas" class="active">Todas</button>
                <button data-status="abierta">Abiertas</button>
                <button data-status="en_proceso">En Proceso</button>
                <button data-status="finalizada">Finalizadas</button>
            </div>
        </div>

        <div id="orders-table-container">
            <p>Cargando órdenes de trabajo...</p>
        </div>
        <div id="modal-container"></div>
    `;
}

function renderTurnos() {
    return `
        <h2>Agendar Nuevo Turno</h2>
        <p>Completa el formulario para registrar una nueva reserva o consulta los próximos turnos.</p>

        <div class="turnos-layout">

            <div>
                <form id="form-turno" class="form-layout">
                    <div class="form-group">
                        <label for="turno-cliente">Cliente</label>
                        <select id="turno-cliente" name="cliente_id" required><option value="">Cargando clientes...</option></select>
                    </div>
                    <div class="form-group">
                        <label for="turno-vehiculo">Vehículo</label>
                        <select id="turno-vehiculo" name="vehiculo_id" required><option value="">Selecciona un cliente primero</option></select>
                    </div>
                    <div class="form-group">
                        <label for="turno-servicio">Servicio Solicitado</label>
                        <input type="text" id="turno-servicio" name="servicio_solicitado" placeholder="Ej: Cambio de aceite" required>
                    </div>
                    <div class="form-group">
                        <label for="turno-fecha">Fecha y Hora</label>
                        <input type="datetime-local" id="turno-fecha" name="fecha_turno" required>
                    </div>
                    <div class="form-group">
                        <label for="turno-comentarios">Comentarios Adicionales</label>
                        <textarea id="turno-comentarios" name="comentarios" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn-submit">Agendar Turno</button>
                </form>
                <div id="turno-mensaje"></div>
            </div>

            <div class="report-container">
                <h3>Próximos Turnos</h3>
                <div id="lista-turnos-container">
                    <p>Cargando turnos...</p>
                </div>
            </div>

        </div>
    `;
}

function renderInventario() {
    return `
        <h2>Control de Inventario</h2>
        <p>Gestiona el stock de todos los repuestos y suministros del taller.</p>
        <div id="inventory-list-container"></div>
    `;
}

function renderReportes() {
    return `
        <h2>Reportes del Taller</h2>
        <p>Aquí puedes consultar datos y estadísticas importantes sobre el rendimiento del taller.</p>
        <div class="report-container">
            <h3>Trabajos Finalizados por Técnico</h3>
            <div id="report-content">
                <p>Generando reporte...</p>
            </div>
        </div>
    `;
}

function renderContacto() {
    return `
        <h2>Contacto y Ubicación</h2>
        <div class="contact-layout">
            <div class="contact-info">
                <h3>Mecanica Guiñazu</h3>
                <p><strong>Dirección:</strong> Av. Siempre Viva 123, San Martín, Mendoza</p>
                <p><strong>Teléfono:</strong> +54 263 412 3456</p>
                <p><strong>Horarios:</strong> Lunes a Viernes de 8:30 a 18:00 hs.</p>
                
                <h4>Envíanos un mensaje</h4>
                <form id="form-contacto" class="form-layout" style="padding:0;">
                    <div class="form-group">
                        <label for="contact-name">Nombre</label>
                        <input type="text" id="contact-name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="contact-email">Email</label>
                        <input type="email" id="contact-email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="contact-message">Mensaje</label>
                        <textarea id="contact-message" name="message" rows="4" required></textarea>
                    </div>
                    <button type="submit" class="btn-submit">Enviar</button>
                </form>
            </div>
            <div class="contact-map">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26804.10658821434!2d-68.50293042089843!3d-32.87926949999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e0b8d23e5a5e9%3A0x2d323023b3a7263a!2sPlaza%20San%20Mart%C3%ADn!5e0!3m2!1ses-419!2sar!4v1696563390000" 
                    width="100%" 
                    height="100%" 
                    style="border:0;" 
                    allowfullscreen="" 
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
        </div>
    `;
}

function renderServiceForm(servicio = {}) {
    const isEditing = servicio.id;
    const title = isEditing ? 'Editar Servicio' : 'Añadir Nuevo Servicio';
    const buttonText = isEditing ? 'Actualizar' : 'Guardar';

    return `
        <div id="service-modal" class="modal">
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>${title}</h2>
                <form id="form-servicio" class="form-layout">
                    <input type="hidden" name="id" value="${servicio.id || ''}">
                    <div class="form-group">
                        <label for="servicio-nombre">Nombre del Servicio</label>
                        <input type="text" id="servicio-nombre" name="nombre" value="${servicio.nombre || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="servicio-categoria">Categoría</label>
                        <select id="servicio-categoria" name="categoria" required>
                            <option value="mecánica" ${servicio.categoria === 'mecánica' ? 'selected' : ''}>Mecánica</option>
                            <option value="electricidad" ${servicio.categoria === 'electricidad' ? 'selected' : ''}>Electricidad</option>
                            <option value="neumáticos" ${servicio.categoria === 'neumáticos' ? 'selected' : ''}>Neumáticos</option>
                            <option value="diagnósticos" ${servicio.categoria === 'diagnósticos' ? 'selected' : ''}>Diagnósticos</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="servicio-precio">Precio</label>
                        <input type="number" step="0.01" id="servicio-precio" name="precio" value="${servicio.precio || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="servicio-descripcion">Descripción</label>
                        <textarea id="servicio-descripcion" name="descripcion" rows="3">${servicio.descripcion || ''}</textarea>
                    </div>
                    <button type="submit" class="btn-submit">${buttonText}</button>
                </form>
            </div>
        </div>
    `;
}

function renderClientForm(cliente = {}) {
    const isEditing = cliente.id;
    const title = isEditing ? 'Editar Cliente' : 'Añadir Nuevo Cliente';
    const buttonText = isEditing ? 'Actualizar' : 'Guardar';

    return `
        <div id="client-modal" class="modal">
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>${title}</h2>
                <form id="form-cliente" class="form-layout">
                    <input type="hidden" name="id" value="${cliente.id || ''}">
                    <div class="form-group">
                        <label for="cliente-nombre">Nombre</label>
                        <input type="text" id="cliente-nombre" name="nombre" value="${cliente.nombre || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="cliente-apellido">Apellido</label>
                        <input type="text" id="cliente-apellido" name="apellido" value="${cliente.apellido || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="cliente-telefono">Teléfono</label>
                        <input type="tel" id="cliente-telefono" name="telefono" value="${cliente.telefono || ''}">
                    </div>
                    <div class="form-group">
                        <label for="cliente-email">Email</label>
                        <input type="email" id="cliente-email" name="email" value="${cliente.email || ''}">
                    </div>
                    <div class="form-group">
                        <label for="cliente-direccion">Dirección</label>
                        <input type="text" id="cliente-direccion" name="direccion" value="${cliente.direccion || ''}">
                    </div>
                    <button type="submit" class="btn-submit">${buttonText}</button>
                </form>
            </div>
        </div>
    `;
}

function renderVehicleForm(vehiculo = {}, clientes = []) {
    const isEditing = vehiculo.id;
    const title = isEditing ? 'Editar Vehículo' : 'Añadir Nuevo Vehículo';

    // Creamos las opciones para el select de clientes
    let optionsClientes = clientes.map(cliente => 
        `<option value="${cliente.id}" ${vehiculo.cliente_id == cliente.id ? 'selected' : ''}>
            ${cliente.apellido}, ${cliente.nombre}
        </option>`
    ).join('');

    return `
        <div id="vehicle-modal" class="modal">
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>${title}</h2>
                <form id="form-vehiculo" class="form-layout">
                    <input type="hidden" name="id" value="${vehiculo.id || ''}">

                    <div class="form-group">
                        <label for="vehiculo-cliente">Propietario</label>
                        <select id="vehiculo-cliente" name="cliente_id" required>
                            <option value="">Seleccione un cliente...</option>
                            ${optionsClientes}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="vehiculo-patente">Patente</label>
                        <input type="text" id="vehiculo-patente" name="patente" value="${vehiculo.patente || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="vehiculo-marca">Marca</label>
                        <input type="text" id="vehiculo-marca" name="marca" value="${vehiculo.marca || ''}">
                    </div>
                    <div class="form-group">
                        <label for="vehiculo-modelo">Modelo</label>
                        <input type="text" id="vehiculo-modelo" name="modelo" value="${vehiculo.modelo || ''}">
                    </div>
                    <div class="form-group">
                        <label for="vehiculo-ano">Año</label>
                        <input type="number" id="vehiculo-ano" name="ano" value="${vehiculo.ano || ''}">
                    </div>
                    <div class="form-group">
                        <label for="vehiculo-km">Kilometraje</label>
                        <input type="number" id="vehiculo-km" name="km" value="${vehiculo.km || ''}">
                    </div>

                    <button type="submit" class="btn-submit">${isEditing ? 'Actualizar' : 'Guardar'}</button>
                </form>
            </div>
        </div>
    `;
}

function renderOrderForm(orden = {}, clientes = [], vehiculos = [], tecnicos = []) {
    const isEditing = orden.id;
    const title = isEditing ? 'Editar Orden de Trabajo' : 'Crear Nueva Orden de Trabajo';

    let optionsClientes = clientes.map(c => `<option value="${c.id}" ${orden.cliente_id == c.id ? 'selected' : ''}>${c.apellido}, ${c.nombre}</option>`).join('');
    let optionsVehiculos = vehiculos.filter(v => v.cliente_id == orden.cliente_id).map(v => `<option value="${v.id}" ${orden.vehiculo_id == v.id ? 'selected' : ''}>${v.marca} ${v.modelo} (${v.patente})</option>`).join('');
    let optionsTecnicos = tecnicos.map(t => `<option value="${t.id}" ${orden.tecnico_id == t.id ? 'selected' : ''}>${t.nombre_completo}</option>`).join('');

    return `
        <div id="order-modal" class="modal">
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>${title}</h2>
                <form id="form-orden" class="form-layout">
                    <input type="hidden" name="id" value="${orden.id || ''}">

                    <div class="form-group">
                        <label for="orden-cliente">Cliente</label>
                        <select id="orden-cliente" name="cliente_id" ${isEditing ? 'disabled' : ''} required>
                            <option value="">Seleccione un cliente...</option>
                            ${optionsClientes}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="orden-vehiculo">Vehículo</label>
                        <select id="orden-vehiculo" name="vehiculo_id" ${isEditing ? 'disabled' : ''} required>
                            <option value="">${isEditing ? '' : 'Seleccione un cliente primero...'}</option>
                            ${optionsVehiculos}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="orden-descripcion">Descripción del Problema</label>
                        <textarea id="orden-descripcion" name="descripcion_problema" rows="3" required>${orden.descripcion_problema || ''}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="orden-tecnico">Técnico Asignado</label>
                        <select id="orden-tecnico" name="tecnico_id">
                            <option value="">Sin asignar</option>
                            ${optionsTecnicos}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="orden-estado">Estado</label>
                        <select id="orden-estado" name="estado" required>
                            <option value="abierta" ${orden.estado === 'abierta' ? 'selected' : ''}>Abierta</option>
                            <option value="en_proceso" ${orden.estado === 'en_proceso' ? 'selected' : ''}>En Proceso</option>
                            <option value="finalizada" ${orden.estado === 'finalizada' ? 'selected' : ''}>Finalizada</option>
                            <option value="cancelada" ${orden.estado === 'cancelada' ? 'selected' : ''}>Cancelada</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="orden-tiempo">Tiempo Estimado</label>
                        <input type="text" id="orden-tiempo" name="tiempo_estimado" value="${orden.tiempo_estimado || ''}">
                    </div>

                    <button type="submit" class="btn-submit">${isEditing ? 'Actualizar Orden' : 'Crear Orden'}</button>
                </form>
            </div>
        </div>
    `;
}

function renderTurnos() {
    return `
        <h2>Agendar Nuevo Turno</h2>
        <p>Completa el formulario para registrar una nueva reserva o consulta los próximos turnos.</p>
        
        <div class="turnos-layout">
            
            <div class="form-wrapper">
                <form id="form-turno" class="form-layout">
                    <div class="form-group">
                        <label for="turno-cliente">Cliente</label>
                        <select id="turno-cliente" name="cliente_id" required><option value="">Cargando clientes...</option></select>
                    </div>
                    <div class="form-group">
                        <label for="turno-vehiculo">Vehículo</label>
                        <select id="turno-vehiculo" name="vehiculo_id" required><option value="">Selecciona un cliente primero</option></select>
                    </div>
                    <div class="form-group">
                        <label for="turno-servicio">Servicio Solicitado</label>
                        <input type="text" id="turno-servicio" name="servicio_solicitado" placeholder="Ej: Cambio de aceite" required>
                    </div>
                    <div class="form-group">
                        <label for="turno-fecha">Fecha y Hora</label>
                        <input type="datetime-local" id="turno-fecha" name="fecha_turno" required>
                    </div>
                    <div class="form-group">
                        <label for="turno-comentarios">Comentarios Adicionales</label>
                        <textarea id="turno-comentarios" name="comentarios" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn-submit">Agendar Turno</button>
                </form>
                <div id="turno-mensaje"></div>
            </div>

            <div class="list-wrapper">
                <div class="report-container">
                    <h3>Próximos Turnos</h3>
                    <div id="lista-turnos-container">
                        <p>Cargando turnos...</p>
                    </div>
                </div>
            </div>

        </div>
    `;
}

// Archivo: client/js/ui.js
function renderTurnoForm(turno = {}) {
    const fechaParaInput = turno.fecha_turno ? new Date(new Date(turno.fecha_turno).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : '';

    return `
        <div id="turno-modal" class="modal">
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>Editar Turno</h2>
                <form id="form-edit-turno" class="form-layout">
                    <input type="hidden" name="id" value="${turno.id || ''}">

                    <div class="form-group">
                        <label>Cliente:</label>
                        <p>${turno.cliente_apellido || ''}, ${turno.cliente_nombre || ''}</p>
                    </div>
                    <div class="form-group">
                        <label>Vehículo:</label>
                        <p>${turno.marca || ''} ${turno.modelo || ''} (${turno.patente || ''})</p>
                    </div>

                    <div class="form-group">
                        <label for="turno-servicio-edit">Servicio Solicitado</label>
                        <input type="text" id="turno-servicio-edit" name="servicio_solicitado" value="${turno.servicio_solicitado || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="turno-fecha-edit">Fecha y Hora</label>
                        <input type="datetime-local" id="turno-fecha-edit" name="fecha_turno" value="${fechaParaInput}" required>
                    </div>
                    <div class="form-group">
                        <label for="turno-estado-edit">Estado</label>
                        <select id="turno-estado-edit" name="estado" required>
                            <option value="pendiente" ${turno.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="confirmado" ${turno.estado === 'confirmado' ? 'selected' : ''}>Confirmado</option>
                            <option value="cancelado" ${turno.estado === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="turno-comentarios-edit">Comentarios</label>
                        <textarea id="turno-comentarios-edit" name="comentarios" rows="3">${turno.comentarios || ''}</textarea>
                    </div>
                    <button type="submit" class="btn-submit">Actualizar Turno</button>
                </form>
            </div>
        </div>
    `;
}
// Archivo: client/js/ui.js - AÑADIR ESTA FUNCIÓN
function renderInventoryForm(item = {}) {
    const isEditing = item.id;
    const title = isEditing ? 'Editar Item del Inventario' : 'Añadir Nuevo Item';

    return `
        <div id="inventory-modal" class="modal">
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>${title}</h2>
                <form id="form-inventario" class="form-layout">
                    <input type="hidden" name="id" value="${item.id || ''}">
                    <div class="form-group">
                        <label for="item-nombre">Nombre del Repuesto</label>
                        <input type="text" id="item-nombre" name="nombre" value="${item.nombre || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="item-descripcion">Descripción</label>
                        <textarea id="item-descripcion" name="descripcion" rows="3">${item.descripcion || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="item-cantidad">Cantidad en Stock</label>
                        <input type="number" id="item-cantidad" name="cantidad_stock" value="${item.cantidad_stock || '0'}" required>
                    </div>
                    <div class="form-group">
                        <label for="item-minimo">Stock Mínimo (Alerta)</label>
                        <input type="number" id="item-minimo" name="stock_minimo" value="${item.stock_minimo || '5'}" required>
                    </div>
                    <div class="form-group">
                        <label for="item-precio">Precio de Costo</label>
                        <input type="number" step="0.01" id="item-precio" name="precio_costo" value="${item.precio_costo || '0.00'}">
                    </div>
                    <button type="submit" class="btn-submit">${isEditing ? 'Actualizar' : 'Guardar'}</button>
                </form>
            </div>
        </div>
    `;
}
// Archivo: client/js/ui.js
function renderPersonalForm() {
    return `
        <div id="personal-modal" class="modal">
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>Añadir Nuevo Empleado</h2>
                <form id="form-personal" class="form-layout">
                    <div class="form-group">
                        <label for="personal-nombre">Nombre Completo</label>
                        <input type="text" id="personal-nombre" name="nombre_completo" required>
                    </div>
                    <div class="form-group">
                        <label for="personal-usuario">Nombre de Usuario</label>
                        <input type="text" id="personal-usuario" name="usuario" required>
                    </div>
                    <div class="form-group">
                        <label for="personal-contrasena">Contraseña</label>
                        <input type="password" id="personal-contrasena" name="contrasena" required>
                    </div>
                    <button type="submit" class="btn-submit">Guardar Empleado</button>
                </form>
            </div>
        </div>
    `;
}