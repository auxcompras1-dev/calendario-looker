// Librería oficial de Looker Studio
const dscc = require('@google/dscc');

function drawViz(data) {
  // Limpiar el contenedor antes de redibujar
  document.body.innerHTML = '';
  
  // Crear el contenedor principal del calendario
  const calendarEl = document.createElement('div');
  calendarEl.id = 'calendar';
  calendarEl.style.cssText = 'font-family: Arial, sans-serif; padding: 10px; background: #ffffff;';
  document.body.appendChild(calendarEl);

  // Mapear los datos provenientes de la hoja de cálculo
  const events = [];
  
  if (data.tables && data.tables.DEFAULT) {
    data.tables.DEFAULT.forEach(row => {
      const fecha = row.fechaInicio ? row.fechaInicio[0] : null;
      const titulo = row.tituloOT ? row.tituloOT[0] : 'Sin Nombre';
      const extras = row.detallesExtra ? row.detallesExtra.join(' | ') : 'Sin detalles';

      if (fecha) {
        events.push({
          title: titulo,
          start: fecha,
          detalles: extras
        });
      }
    });
  }

  // Renderizar la vista de tarjeta/calendario
  let htmlContent = `
    <div style="border: 1px solid #dadce0; border-radius: 8px; padding: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.12);">
      <h3 style="margin-top:0; color:#1a73e8; font-size: 16px;">📅 Proyectos y OTs Registradas</h3>
      <div id="eventList"></div>
    </div>
  `;
  
  calendarEl.innerHTML = htmlContent;
  const listEl = document.getElementById('eventList');

  if (events.length === 0) {
    listEl.innerHTML = '<p style="color:#70757a; font-size:13px;">No hay eventos o fechas asignadas en esta selección.</p>';
  } else {
    events.forEach(evt => {
      const card = document.createElement('div');
      card.style.cssText = 'background: #e8f0fe; border-left: 4px solid #1a73e8; padding: 10px 14px; margin-bottom: 8px; border-radius: 4px; cursor: pointer; transition: background 0.2s;';
      
      card.innerHTML = `
        <div style="font-weight: bold; color: #174ea6; font-size: 13px;">📌 ${evt.title}</div>
        <div style="color: #3c4043; font-size: 12px; margin-top: 2px;">🗓️ Inicio: ${evt.start}</div>
      `;

      // Evento al hacer clic: Ventana emergente con el detalle de inversión, tasa, etc.
      card.onclick = () => {
        alert(`🔎 DETALLE DEL PROYECTO / OT\n\n` +
              `• Nombre: ${evt.title}\n` +
              `• Fecha de Inicio: ${evt.start}\n` +
              `• Datos Adicionales: ${evt.detalles}`);
      };

      listEl.appendChild(card);
    });
  }
}

// Suscribirse a las actualizaciones de datos de Looker Studio
dscc.subscribeToData(drawViz, {transform: dscc.objectTransform});
