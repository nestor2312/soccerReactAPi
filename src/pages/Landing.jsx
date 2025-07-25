import { useEffect, useState,useRef } from "react";
import "../App.css";
// Si quieres dos versiones diferentes de Img1, deberías importar dos archivos:
// import Img1Thumbnail from "../assets/Img1_thumbnail.png";
// import Img1FullSize from "../assets/Img1_full.png";
import Img1 from "../assets/Img1.png"; 
import Img2 from "../assets/Img2.png"; 
import Img3 from "../assets/Img3.png"; 
import Img4 from "../assets/Img4.png"; 
import list_items from "../assets/Soccer.png"; 
const Landing = () => {

 // Estado para la moneda seleccionada (COP por defecto)
  const [selectedCurrency, setSelectedCurrency] = useState('COP');
  // Estado para el tipo de facturación (mensual por defecto)
  const [isAnnualBilling, setIsAnnualBilling] = useState(false);

  // Datos de los planes de precios
  const pricingPlans = [
    {
      id: 'multi-torneo', // Nuevo ID
      name: 'Plan Multi Torneo', // Nuevo nombre
      description: 'Ideal para múltiples torneos, categorías y subcategorías', // Nueva descripción
      features: [
        'Torneos, categorías y subcategorías ilimitadas',
        'Equipos ilimitados',
        'Jugadores ilimitados',
        'Clasificación automática',
        'Partidos ilimitados',
        'Fase final desde cuartos de final',
        'Estadísticas (goles, asistencias, tarjetas)',
        'Personalización de diseño opcional',
        'Soporte básico',
        'Hosting + dominio + SSL',
        'Mantenimiento básico'
      ],
      additionalServices: {
        design: 'Diseño Personalizado',
        forms: 'Codificar Formularios'
      },
      prices: {
        COP: { monthly: 180000, annual: 1800000, design: 200000, forms: 100000 },
        USD: { monthly: 45, annual: 450, design: 50, forms: 25 },
        EUR: { monthly: 40, annual: 400, design: 45, forms: 22 }
      }
    },
    {
      id: 'unico-torneo', // Nuevo ID
      name: 'Plan Único Torneo', // Nuevo nombre
      description: 'Para un solo torneo', // Nueva descripción
      features: [
        'Un torneo',
        'Equipos ilimitados',
        'Jugadores ilimitados',
        'Clasificación automática',
        'Partidos ilimitados',
        'Fase final desde cuartos de final',
        'Estadísticas (goles, asistencias, tarjetas)',
         'Soporte básico',
        'Hosting + dominio + SSL',
        'Mantenimiento básico'
      ],
      additionalServices: {
        design: 'Diseño Personalizado',
        forms: 'Codificar Formularios'
      },
      prices: {
        COP: { pagoUnico: 250000, design: 80000, forms: 100000 },
        USD: { pagoUnico: 65, design: 20, forms: 25 }, // Estimaciones basadas en COP
        EUR: { pagoUnico: 60, design: 18, forms: 22 }  // Estimaciones basadas en COP
      }
    }
  ];

  // Función para formatear el precio según la moneda seleccionada
  const formatPrice = (amount, currency) => {
    if (currency === 'COP') {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);
    } else if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    } else if (currency === 'EUR') {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
    }
    return amount; // Fallback
  };




  const slides = [
    // {
    //   id: "slide-1",
    //   title: "Bunker",
    //   subtitle: "Balthazar",
    //   duration: "4.05",
    //   thumbnail: "https://images.unsplash.com/photo-1530651788726-1dbf58eeef1f?auto=format&fit=crop&w=400&q=50", // URL de miniatura Unsplash
    //   fullSize: "https://images.unsplash.com/photo-1530651788726-1dbf58eeef1f?auto=format&fit=crop&w=1200&q=80", // URL de tamaño completo Unsplash
    // },
    {
      id: "slide-2",
      title: "Words Remain",
      subtitle: "Moderator",
      duration: "4.05",
      thumbnail: Img2, 
      fullSize: Img2, 

    },
    {
      id: "slide-3",
      title: "Falling Out",
      subtitle: "Otzeki",
      duration: "4.05",
      thumbnail: Img4, 
      fullSize: Img4, 

    },
    {
      id: "slide-4",
      title: "New Track",
      subtitle: "New Artist",
      duration: "3.50",
      thumbnail: Img3, 
      fullSize: Img3, 
        },
    {
      id: "slide-5",
      title: "Another One",
      subtitle: "Another Artist",
      duration: "4.00",
      thumbnail: Img1, 
      fullSize: Img1,  
    },
  ];

  const [checkedItem, setCheckedItem] = useState(slides[0].id);
  const [expandedImg, setExpandedImg] = useState(null);

  const handleRadioChange = (e) => {
    setCheckedItem(e.target.id);
  };

  const handleImageClick = (slideId, fullSizeImgUrl) => {
    if (slideId === checkedItem) {
      setExpandedImg(fullSizeImgUrl);
    }
  };

  useEffect(() => {
    document.body.classList.add("custom-blue-bg");
    return () => {
      document.body.classList.remove("custom-blue-bg");
    };
  }, []);

  const getCarouselSlideStyles = (slideId, index) => {
    const activeIndex = slides.findIndex(slide => slide.id === checkedItem);
    let transform = 'translateX(0) scale(1)';
    let zIndex = 2;
    let opacity = 1;

    const offset = index - activeIndex;

    if (offset === 1) {
        transform = 'translateX(40%) scale(0.8)';
        zIndex = 1;
        opacity = 0.4;
    } else if (offset === -1) {
        transform = 'translateX(-40%) scale(0.8)';
        zIndex = 1;
        opacity = 0.4;
    } else if (Math.abs(offset) > 1) {
        transform = `translateX(${40 * offset}%) scale(0.6)`;
        zIndex = 0;
        opacity = 0;
    }

    return { transform, zIndex, opacity };
  };

  // Referencias para los elementos que se animarán con IntersectionObserver
  const featuresRef = useRef(null);
  const pricingRef = useRef(null);
  const contactRef = useRef(null);

  // Estado para controlar si las secciones están en la vista
  const [featuresInView, setFeaturesInView] = useState(false);
  const [pricingInView, setPricingInView] = useState(false);
  const [contactInView, setContactInView] = useState(false);

  useEffect(() => {
    // Configuración del Intersection Observer
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.1 // 10% del elemento visible para activar
    };

    // eslint-disable-next-line no-unused-vars
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === featuresRef.current) {
            setFeaturesInView(true);
          } else if (entry.target === pricingRef.current) {
            setPricingInView(true);
          } else if (entry.target === contactRef.current) {
            setContactInView(true);
          }
         
        } else {
         
          if (entry.target === featuresRef.current) { setFeaturesInView(false); }
          else if (entry.target === pricingRef.current) { setPricingInView(false); }
          else if (entry.target === contactRef.current) { setContactInView(false); }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observar las secciones
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (pricingRef.current) observer.observe(pricingRef.current);
    if (contactRef.current) observer.observe(contactRef.current);

    // Limpiar el observador al desmontar el componente
    return () => {
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (pricingRef.current) observer.unobserve(pricingRef.current);
      if (contactRef.current) observer.unobserve(contactRef.current);
    };
  }, []);

  return (
    <>
      
  
   <div className="min-h-screen ">
    
  
   {/* Navbar (para el logo) */}
        <nav className="navbar navbar-expand-lg position-absolute top-0 start-0 end-0 p-4  ">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              {/* Usando una URL de placeholder para el logo */}
              <img src="https://placehold.co/160x40/00A878/FFFFFF?text=Fúbol+Logo" alt="Fubol Logo" style={{ width: '160px' }} className="img-fluid" />
            </a>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-5 flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="container-fluid my-5 px-4">
            <div className="row align-items-center justify-content-center text-center text-md-start">
              {/* Columna de Contenido (Carrusel de Imágenes del Sistema) */}
              <div className="col-md-6 py-5 d-flex justify-content-center justify-content-md-end order-2 order-md-1 mt-4 mt-md-0">
                {/* Carrusel de Bootstrap para mostrar la personalización */}
               <div className="carousel-wrapper animate-scale-in is-in-view"> 
        {slides.map((slide) => (
          <input
            key={slide.id}
            type="radio"
            name="custom-slider"
            id={slide.id}
            checked={checkedItem === slide.id}
            onChange={handleRadioChange}
          />
        ))}

        <div className="carousel-track">
          {slides.map((slide, index) => {
            const slideStyles = getCarouselSlideStyles(slide.id, index);
            return (
              <label
                key={slide.id}
                htmlFor={slide.id}
                className="carousel-slide"
                style={{
                  transform: slideStyles.transform,
                  zIndex: slideStyles.zIndex,
                  opacity: slideStyles.opacity,
                }}
                onClick={() => handleImageClick(slide.id, slide.fullSize)}
              >
                {/* Aquí se usa la miniatura */}
                <img src={slide.thumbnail} alt={slide.title} />
              </label>
            );
          })}
        </div>

        
      </div>

      {expandedImg && (
        <div className="image-modal-overlay" onClick={() => setExpandedImg(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={expandedImg} alt="Imagen expandida" />
            <button className="close-modal-btn" onClick={() => setExpandedImg(null)}>X</button>
          </div>
        </div>
      )}
              </div>

              {/* Columna de Texto y CTA */}
             <div className="col-md-6 order-1 order-md-2 ps-md-5">
                <h1 className="display-4 fw-bold mb-3 text-font animate-fade-in-up is-in-view delay-100"> {/* Animación de entrada */}
                  <strong className="text-fubol">Fúbol </strong>El Control Total de Tu Torneo.
                </h1>
               <p className="color-text1 lead mb-4 text-left animate-fade-in-up is-in-view delay-200"> {/* Animación de entrada */}
                  Lleva el control de tu torneo paso a paso: crea tus encuentros, publica resultados y motiva a tu equipo con estadísticas en tiempo real.
                </p>
                <a
                  href="#contact"
                  className="btn btn-success btn-lg btn-custom-cta" /* Ahora btn-primary usará tu verde */
                >
                  Solicita una demo
                </a>
              </div>
            </div>
          </div>
        </section>
  
  
  
  
          {/* Features Section */}
          <section ref={featuresRef} className="py-3 fondo1"> {/* py-12 md:py-20 */}
            <div className="container my-3 px-4"> {/* mx-auto px-6 */}
<h2 className={`h2 fw-bold text-center  mb-5 text-font text-white animate-fade-in-up ${featuresInView ? 'is-in-view' : ''}`}>Características Principales</h2>     
         <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 d-flex justify-content-evenly"> {/* grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 */}
                {/* Característica 1: Programación de Partidos */}
               <div className="col hc">
  <div className={`card h-100 text-center fond-card1 shadow-lg p-3 position-relative overflow-hidden animate-fade-in-up ${featuresInView ? 'is-in-view delay-100' : ''}`}>
    <h3 className="h5 fw-semibold mb-2 text-font">Programación de Partidos</h3>
    <p className="text-muted color-text2">
      Crea y gestiona manualmente el calendario de encuentros de forma sencilla y organizada.
    </p>
  </div>
</div>

  
                {/* Característica 2: Tablas de Posición */}
                <div className="col hc">
                   <div className={`card h-100 text-center fond-card2  shadow-lg p-3 position-relative overflow-hidden animate-fade-in-up ${featuresInView ? 'is-in-view delay-200' : ''}`}>
                    {/* Aquí iría un <img src="/icons/table.svg" alt="Icono de Tabla" className="w-16 h-16 mb-4" /> */}
                    <h3 className="h5 fw-semibold mb-2 text-font">Tablas de Posición</h3>
                    <p className="text-muted color-text2">
                      Visualiza la clasificación en tiempo real, con puntos, goles a favor y en contra.
                    </p>
                  </div>
                </div>
  
                {/* Característica 3: Estadísticas */}
                <div className="col hc">
                   <div className={`card h-100 text-center fond-card3 shadow-lg p-3 position-relative overflow-hidden animate-fade-in-up ${featuresInView ? 'is-in-view delay-300' : ''}`}>
                    {/* Aquí iría un <img src="/icons/stats.svg" alt="Icono de Estadísticas" className="w-16 h-16 mb-4" /> */}
                    <h3 className="h5 fw-semibold mb-2 text-font">Estadísticas</h3>
                    <p className="text-muted color-text2">
                      Consulta ranking de goleadores y asistencias para impulsar la motivación.
                    </p>
                  </div>
                </div>
  
                {/* Característica 4: Diseño Personalizado (¡Tu Diferenciador!) */}
                <div className="col hc">
                  <div className={`card h-100 text-center shadow-lg p-3 animate-fade-in-up ${featuresInView ? 'is-in-view delay-400' : ''}`}>
                    {/* Aquí iría un <img src="/icons/palette.svg" alt="Icono de Paleta de Colores" className="w-16 h-16 mb-4" /> */}
                    <h3 className="h5 fw-semibold mb-2 text-font">Diseño Personalizado</h3>
                    <p className="text-muted color-text2">
                      Adapta la plataforma con tu logo, colores de marca y elementos visuales para una experiencia única y profesional.
                    </p>
                  </div>
                </div>
  
                {/* Característica 5: Formularios Personalizados (¡Tu Diferenciador!) */}
                <div className="col hc">
                  <div className={`card h-100 text-center shadow-lg p-3 animate-fade-in-up ${featuresInView ? 'is-in-view delay-500' : ''}`}>
                    {/* Aquí iría un <img src="/icons/form.svg" alt="Icono de Formulario" className="w-16 h-16 mb-4" /> */}
                    <h3 className="h5 fw-semibold mb-2 text-font">Campos y Formularios a Tu Medida</h3>
                    <p className="text-muted color-text2">
                      Crea formularios de inscripción con campos personalizados para capturar todos los datos relevantes de jugadores y equipos.
                    </p>
                  </div>
                </div>
  
              </div>
            </div>
          </section>
  
  
  
  
  
     {/* Pricing Section */}
         <section  ref={pricingRef} id="pricing" className="py-5 bg-white"> {/* Añadido bg-white para consistencia */}
          <div className="container my-5 px-4 text-center">
             <h2 className={`h2 fw-bold mb-5 text-font text-fubol animate-fade-in-up ${pricingInView ? 'is-in-view' : ''}`}>Planes y Precios</h2>

            <div className={`d-flex justify-content-center mb-4 animate-fade-in-up ${pricingInView ? 'is-in-view delay-100' : ''}`}>
              <div className="btn-group me-3" role="group" aria-label="Selector de Moneda">
                <button
                  type="button"
                  className={`btn btn-outline-primary ${selectedCurrency === 'COP' ? 'active' : ''}`}
                  onClick={() => setSelectedCurrency('COP')}
                >
                  COP
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-primary ${selectedCurrency === 'USD' ? 'active' : ''}`}
                  onClick={() => setSelectedCurrency('USD')}
                >
                  USD
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-primary ${selectedCurrency === 'EUR' ? 'active' : ''}`}
                  onClick={() => setSelectedCurrency('EUR')}
                >
                  EUR
                </button>
              </div>
              {/* Solo mostrar el switch de facturación anual si el plan actual es el 'multi-torneo' */}
              {pricingPlans.some(plan => plan.id === 'multi-torneo' && (plan.prices[selectedCurrency].monthly || plan.prices[selectedCurrency].annual)) && (
                <div className="form-check form-switch d-flex align-items-center text-muted">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="annualBillingSwitch"
                    checked={isAnnualBilling}
                    onChange={() => setIsAnnualBilling(!isAnnualBilling)}
                  />
                  <label className="form-check-label ms-2" htmlFor="annualBillingSwitch">
                    Ver Facturación Anual (¡Ahorra!)
                  </label>
                </div>
              )}
            </div>

            <div className="row row-cols-1 row-cols-md-2 g-4 justify-content-center">
              {pricingPlans.map(plan => (
                <div className="col d-flex" key={plan.id}>
                  {/* Resaltar el Plan Multi Torneo */}
                  <div className={`card h-100 pricing-card ${plan.id === 'multi-torneo' ? 'pricing-card-highlight' : ''}`}>
                    <div className="card-body d-flex flex-column">
                      <h3 className="h4 fw-semibold mb-3 text-font">{plan.name}</h3>
                      <p className="text-muted mb-3">{plan.description}</p>
                      
                      {/* Lógica condicional para mostrar precios mensuales/anuales o pago único */}
                      {plan.prices[selectedCurrency].monthly !== undefined || plan.prices[selectedCurrency].annual !== undefined ? (
                        <p className="display-5 fw-bold mb-1 text-fubol">
                          {formatPrice(isAnnualBilling ? plan.prices[selectedCurrency].annual : plan.prices[selectedCurrency].monthly, selectedCurrency)}
                          <span className="fs-6 text-muted ">/{isAnnualBilling ? 'año' : 'mes'}</span>
                        </p>
                      ) : (
                        <p className="display-5 fw-bold mb-1 text-fubol">
                          {formatPrice(plan.prices[selectedCurrency].pagoUnico, selectedCurrency)}
                          <span className="fs-6 text-muted "> (Pago Único)</span>
                        </p>
                      )}

                      {/* Mostrar ahorro solo para planes con facturación anual y si isAnnualBilling es true */}
                      {isAnnualBilling && plan.prices[selectedCurrency].annual !== undefined && (
                        <p className="text-success fw-bold mb-3">
                          ¡Ahorra {formatPrice((plan.prices[selectedCurrency].monthly * 12) - plan.prices[selectedCurrency].annual, selectedCurrency)} al año!
                        </p>
                      )}
                      
                      <ul className="list-unstyled text-start mb-4 flex-grow-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="pricing-list-item">
                           <img src={list_items} width="16" height="16" className="plus-circle"  alt="" />
                           
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="mb-4 text-start">
                        <p className="fw-semibold mb-2">Servicios Adicionales (Costo Único):</p>
                        <ul className="list-unstyled">
                          <li className="pricing-list-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                            </svg>
                            {plan.additionalServices.design}: {formatPrice(plan.prices[selectedCurrency].design, selectedCurrency)}
                          </li>
                          <li className="pricing-list-item">
                            <svg xmlns="http://www.w3.org/2000s/ssvg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                            </svg>
                            {plan.additionalServices.forms}: {formatPrice(plan.prices[selectedCurrency].forms, selectedCurrency)}
                          </li>
                        </ul>
                      </div>
                      
                      <a href="#contact" className="btn btn-primary btn-lg mt-auto btn-custom-cta">
                        {plan.id === 'unico-torneo' ? 'Contratar Plan' : 'Comenzar prueba'}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
  
      {/* Contact Section */}
          <section id="contact" ref={contactRef} className="py-5 bg-light"> {/* py-20 */}
            <div className="container my-5 px-4 text-center"> {/* mx-auto px-6 */}
 <h2 className={`h2 fw-bold mb-4 text-font text-fubol animate-fade-in-up ${contactInView ? 'is-in-view' : ''}`}>¿Listo para empezar?</h2>
            <p className={`lead mb-4 color-text1 animate-fade-in-up ${contactInView ? 'is-in-view delay-100' : ''}`}>Déjanos tus datos y agendemos tu demo gratuita.</p>              <form className="mx-auto" style={{ maxWidth: '600px' }}> {/* max-w-xl mx-auto */}
               <div className={`mb-3 animate-fade-in-up ${contactInView ? 'is-in-view delay-200' : ''}`}>
                  <input type="text" className="form-control form-control-lg rounded-pill" placeholder="Nombre completo" /> {/* border border-gray-300 p-3 rounded */}
                </div>
                  <div className={`mb-3 animate-fade-in-up ${contactInView ? 'is-in-view delay-300' : ''}`}>
                  <input type="email" className="form-control form-control-lg rounded-pill" placeholder="Correo electrónico" /> {/* border border-gray-300 p-3 rounded */}
                </div>
                 <div className={`mb-3 animate-fade-in-up ${contactInView ? 'is-in-view delay-400' : ''}`}>
                  <input type="text" className="form-control form-control-lg rounded-pill" placeholder="Institución o liga" /> {/* border border-gray-300 p-3 rounded */}
                </div>
                <button
                  type="submit"
                 className={`btn btn-primary btn-lg btn-custom-cta animate-fade-in-up ${contactInView ? 'is-in-view delay-600' : ''}`}
                >
                  Enviar solicitud
                </button>
              </form>
            </div>
          </section>
  
         
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-6 text-center">
            <p className="bg-gray-800 text-white py-6">© {new Date().getFullYear()} Fubol. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;














