import { NextResponse } from "next/server"

// Lista de ciudades por país y estado/provincia
const citiesByCountryAndState: Record<string, Record<string, string[]>> = {
  ES: {
    Andalucía: ["Sevilla", "Málaga", "Granada", "Córdoba", "Cádiz", "Almería", "Huelva", "Jaén"],
    Madrid: ["Madrid", "Alcalá de Henares", "Móstoles", "Fuenlabrada", "Leganés", "Getafe", "Alcorcón"],
    Cataluña: ["Barcelona", "Tarragona", "Lleida", "Girona", "Sabadell", "Terrassa", "Badalona"],
    "Comunidad Valenciana": ["Valencia", "Alicante", "Castellón", "Elche", "Torrevieja", "Benidorm"],
    "País Vasco": ["Bilbao", "San Sebastián", "Vitoria", "Barakaldo", "Getxo", "Irún"],
    Galicia: ["La Coruña", "Vigo", "Santiago de Compostela", "Ourense", "Lugo", "Pontevedra"],
    "Castilla y León": ["Valladolid", "Salamanca", "Burgos", "León", "Palencia", "Segovia", "Ávila", "Zamora", "Soria"],
    Canarias: ["Las Palmas", "Santa Cruz de Tenerife", "La Laguna", "Arrecife", "Puerto del Rosario"],
    Aragón: ["Zaragoza", "Huesca", "Teruel", "Calatayud", "Ejea de los Caballeros"],
    Asturias: ["Oviedo", "Gijón", "Avilés", "Langreo", "Mieres", "Siero"],
    Baleares: ["Palma", "Ibiza", "Mahón", "Manacor", "Calviá", "Ciudadela"],
    Cantabria: ["Santander", "Torrelavega", "Castro-Urdiales", "Camargo", "Piélagos"],
    "Castilla-La Mancha": ["Toledo", "Albacete", "Ciudad Real", "Guadalajara", "Cuenca", "Talavera de la Reina"],
    Extremadura: ["Badajoz", "Cáceres", "Mérida", "Plasencia", "Don Benito", "Villanueva de la Serena"],
    "La Rioja": ["Logroño", "Calahorra", "Arnedo", "Haro", "Alfaro", "Lardero"],
    Murcia: ["Murcia", "Cartagena", "Lorca", "Molina de Segura", "Alcantarilla", "Cieza"],
    Navarra: ["Pamplona", "Tudela", "Barañáin", "Burlada", "Estella", "Tafalla"],
  },
  MX: {
    "Ciudad de México": ["Ciudad de México", "Coyoacán", "Tlalpan", "Xochimilco", "Iztapalapa", "Gustavo A. Madero"],
    Jalisco: ["Guadalajara", "Zapopan", "Tlaquepaque", "Tonalá", "Puerto Vallarta", "Lagos de Moreno"],
    "Nuevo León": ["Monterrey", "San Nicolás de los Garza", "Guadalupe", "Apodaca", "San Pedro Garza García"],
    Puebla: ["Puebla", "Tehuacán", "San Martín Texmelucan", "Atlixco", "Amozoc", "Cholula"],
    "Estado de México": ["Toluca", "Ecatepec", "Nezahualcóyotl", "Naucalpan", "Tlalnepantla", "Chimalhuacán"],
    "Baja California": ["Tijuana", "Mexicali", "Ensenada", "Rosarito", "Tecate", "San Felipe"],
    Chihuahua: ["Ciudad Juárez", "Chihuahua", "Delicias", "Cuauhtémoc", "Parral", "Nuevo Casas Grandes"],
    Guanajuato: ["León", "Irapuato", "Celaya", "Salamanca", "Guanajuato", "San Miguel de Allende"],
    Veracruz: ["Veracruz", "Xalapa", "Coatzacoalcos", "Córdoba", "Orizaba", "Poza Rica"],
    Sonora: ["Hermosillo", "Ciudad Obregón", "Nogales", "San Luis Río Colorado", "Guaymas", "Navojoa"],
  },
  US: {
    California: ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "San Jose", "Oakland", "Fresno"],
    Texas: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth", "El Paso", "Arlington"],
    "New York": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany", "New Rochelle"],
    Florida: ["Miami", "Orlando", "Tampa", "Jacksonville", "St. Petersburg", "Hialeah", "Fort Lauderdale"],
    Illinois: ["Chicago", "Aurora", "Rockford", "Joliet", "Naperville", "Springfield", "Peoria"],
    Pennsylvania: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading", "Scranton", "Bethlehem"],
    Ohio: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton", "Parma"],
    Michigan: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor", "Lansing", "Flint"],
    Georgia: ["Atlanta", "Augusta", "Columbus", "Savannah", "Athens", "Sandy Springs", "Roswell"],
    "North Carolina": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem", "Fayetteville", "Cary"],
  },
  AR: {
    "Buenos Aires": ["Buenos Aires", "La Plata", "Mar del Plata", "Quilmes", "Bahía Blanca", "Tandil", "San Isidro"],
    Córdoba: ["Córdoba", "Río Cuarto", "Villa María", "San Francisco", "Alta Gracia", "Jesús María"],
    "Santa Fe": ["Rosario", "Santa Fe", "Rafaela", "Venado Tuerto", "Reconquista", "Santo Tomé"],
    Mendoza: ["Mendoza", "San Rafael", "Godoy Cruz", "Maipú", "Luján de Cuyo", "Guaymallén"],
    Tucumán: ["San Miguel de Tucumán", "Yerba Buena", "Tafí Viejo", "Alderetes", "Banda del Río Salí"],
    "Entre Ríos": ["Paraná", "Concordia", "Gualeguaychú", "Concepción del Uruguay", "Gualeguay", "Villaguay"],
  },
  CO: {
    Antioquia: ["Medellín", "Bello", "Envigado", "Itagüí", "Rionegro", "Apartadó", "Turbo"],
    Cundinamarca: ["Bogotá", "Soacha", "Facatativá", "Zipaquirá", "Chía", "Mosquera", "Funza"],
    "Valle del Cauca": ["Cali", "Buenaventura", "Palmira", "Tuluá", "Cartago", "Buga", "Yumbo"],
    Atlántico: ["Barranquilla", "Soledad", "Malambo", "Sabanalarga", "Baranoa", "Puerto Colombia"],
    Santander: ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta", "Barrancabermeja", "San Gil"],
    Bolívar: ["Cartagena", "Magangué", "El Carmen de Bolívar", "Turbaco", "Arjona", "San Juan Nepomuceno"],
  },
}

// Lista de ciudades populares para cuando no hay filtros específicos
const popularCities = [
  "Madrid",
  "Barcelona",
  "Valencia",
  "Sevilla",
  "Zaragoza",
  "Málaga",
  "Murcia",
  "Palma",
  "Las Palmas",
  "Bilbao",
  "Alicante",
  "Córdoba",
  "Valladolid",
  "Vigo",
  "Gijón",
  "L'Hospitalet",
  "La Coruña",
  "Vitoria",
  "Granada",
  "Elche",
  "Oviedo",
  "Badalona",
  "Cartagena",
  "Terrassa",
  "Jerez",
  "Sabadell",
  "Móstoles",
  "Ciudad de México",
  "Guadalajara",
  "Monterrey",
  "Puebla",
  "Tijuana",
  "León",
  "Juárez",
  "Torreón",
  "Nueva York",
  "Los Ángeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Filadelfia",
  "San Antonio",
  "San Diego",
  "Buenos Aires",
  "Córdoba",
  "Rosario",
  "Mendoza",
  "La Plata",
  "San Miguel de Tucumán",
  "Mar del Plata",
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Cúcuta",
  "Bucaramanga",
  "Pereira",
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")?.toLowerCase() || ""
  const country = searchParams.get("country") || ""
  const state = searchParams.get("state") || ""

  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  let filteredCities: string[] = []

  // Si tenemos país y estado, filtramos por ellos
  if (country && state && citiesByCountryAndState[country] && citiesByCountryAndState[country][state]) {
    filteredCities = citiesByCountryAndState[country][state].filter((city) => city.toLowerCase().includes(query))
  }
  // Si solo tenemos país, combinamos todas las ciudades de ese país
  else if (country && citiesByCountryAndState[country]) {
    const allCitiesInCountry: string[] = []
    Object.values(citiesByCountryAndState[country]).forEach((cities) => {
      allCitiesInCountry.push(...cities)
    })
    filteredCities = allCitiesInCountry.filter((city) => city.toLowerCase().includes(query))
  }
  // Si no tenemos filtros específicos, usamos la lista general
  else {
    filteredCities = popularCities.filter((city) => city.toLowerCase().includes(query))
  }

  // Eliminar duplicados y limitar a 10 resultados
  const uniqueCities = [...new Set(filteredCities)].slice(0, 10)

  return NextResponse.json({ suggestions: uniqueCities })
}
