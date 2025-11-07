import React from 'react';
import { GiftIcon, StarIcon } from '../shared/components/LoyaltyIcons';

const HelpPage = ({ onBackToLogin }) => {
  const faqs = [
    {
      question: "¿Cómo funciona el programa de lealtad FLEVO?",
      answer: "FLEVO es un programa de recompensas donde acumulas puntos con cada compra y los puedes canjear por premios exclusivos, descuentos y experiencias únicas."
    },
    {
      question: "¿Cómo puedo acumular puntos?",
      answer: "Puedes acumular puntos realizando compras, completando desafíos, refiriendo amigos y participando en promociones especiales."
    },
    {
      question: "¿Cómo canjeo mis puntos?",
      answer: "Ve a la sección de recompensas en tu cuenta, selecciona el premio que deseas y confirma el canje. Los puntos se descontarán automáticamente."
    },
    {
      question: "¿Los puntos tienen fecha de vencimiento?",
      answer: "Los puntos son válidos por 12 meses desde la fecha de acumulación. Te notificaremos antes de que expiren."
    },
    {
      question: "¿Puedo transferir puntos a otro usuario?",
      answer: "Actualmente no es posible transferir puntos entre cuentas. Los puntos son personales e intransferibles."
    },
    {
      question: "¿Cómo actualizo mi información personal?",
      answer: "Ve a tu perfil, selecciona 'Editar información' y actualiza los datos que necesites. No olvides guardar los cambios."
    },
    {
      question: "¿Qué hago si olvidé mi contraseña?",
      answer: "En la pantalla de login, selecciona '¿Olvidaste tu contraseña?' e ingresa tu email. Te enviaremos un código para restablecerla."
    },
    {
      question: "¿Cómo contacto al soporte técnico?",
      answer: "Puedes contactarnos a través de nuestras redes sociales o enviando un email a soporte@flevo.com. Respondemos en menos de 24 horas."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-slate-50 to-yellow-100 animate-gradient-shift p-4" style={{ backgroundSize: '400% 400%' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="relative mb-8">
          <div className="bg-gradient-to-br from-flevo-900 to-flevo-950 rounded-t-3xl px-6 py-8 text-center shadow-xl relative overflow-hidden" style={{ borderBottomLeftRadius: '50% 30px', borderBottomRightRadius: '50% 30px' }}>
            <div className="absolute top-3 left-3 opacity-80" style={{ color: '#f9bc18' }}>
              <GiftIcon className="w-5 h-5" />
            </div>
            <div className="absolute top-3 right-3 opacity-80" style={{ color: '#f9bc18' }}>
              <StarIcon className="w-5 h-5" />
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-2xl font-bold text-white font-poppins">❓</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1 font-poppins">
              Centro de Ayuda
            </h1>
            <p className="text-flevo-100 text-sm font-medium">
              Preguntas frecuentes sobre FLEVO
            </p>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-slate-100 pb-6 last:border-b-0 last:pb-0">
                <h3 className="text-lg font-bold text-flevo-900 mb-3 flex items-start">
                  <span className="text-accent-500 mr-2 mt-1">Q{index + 1}.</span>
                  {faq.question}
                </h3>
                <p className="text-slate-600 leading-relaxed ml-8">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="bg-gradient-to-r from-accent-50 to-flevo-50 rounded-xl p-6 text-center">
              <h3 className="text-lg font-bold text-flevo-900 mb-2">
                ¿No encontraste lo que buscabas?
              </h3>
              <p className="text-slate-600 mb-4">
                Nuestro equipo de soporte está aquí para ayudarte
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <span className="text-flevo-700 font-medium">📧 soporte@flevo.com</span>
                <span className="text-slate-400">|</span>
                <span className="text-flevo-700 font-medium">📱 Síguenos en redes sociales</span>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-8">
            <button 
              onClick={onBackToLogin}
              className="bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              ← Volver al Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;