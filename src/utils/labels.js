const labels = {
  All: 'Todos', Lead: 'Prospecto', Qualified: 'Calificado', Viewing: 'Visita',
  Negotiation: 'Negociación', Won: 'Ganada', Lost: 'Perdida', Available: 'Disponible',
  'Under offer': 'En oferta', Sold: 'Vendida', Rented: 'Alquilada', New: 'Nuevo',
  Active: 'Activo', Inactive: 'Inactivo', Pending: 'Pendiente', 'In progress': 'En curso',
  Completed: 'Completada', High: 'Alta', Medium: 'Media', Low: 'Baja', Buyer: 'Comprador',
  Seller: 'Vendedor', Investor: 'Inversionista', Partner: 'Socio', Villa: 'Villa',
  Apartment: 'Departamento', Penthouse: 'Ático', House: 'Casa', Commercial: 'Comercial', Land: 'Terreno',
};
export const label = (value) => labels[value] || value;
export const resourceLabel = (resource, singular = false) => ({
  properties: singular ? 'propiedad' : 'Propiedades',
  contacts: singular ? 'contacto' : 'Contactos',
  deals: singular ? 'oportunidad' : 'Oportunidades',
  tasks: singular ? 'tarea' : 'Tareas',
}[resource] || resource);
