import imgAbout from "../assets/about_img/img4_about.jpg";
import TextBoxWithTextOnTop from "../components/TextBoxWithTextOnTop";

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold mb-4">Contáctame</h2>
          <p className="text-lg text-gray-600">
            Déjame un mensaje y me pondré en contacto contigo.
          </p>
          <form className="space-y-4">
            <div>
              <TextBoxWithTextOnTop
                text="Nombre"
                type="text"
                placeholder="Ingresa tu nombre"
              />
            </div>
            <div>
              <TextBoxWithTextOnTop
                text="Correo electrónico"
                type="email"
                placeholder="Ingresa tu correo electrónico"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-lg text-gray-800">
                Mensaje
              </label>
              <textarea
                id="message"
                placeholder="Escribe tu mensaje"
                className="block w-full h-32 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
            <button type="submit" className="btn btn-accent w-full">
              Enviar
            </button>
          </form>
        </div>

        {/* Social Media */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold mb-4">Sígueme</h2>
          <p className="text-lg text-gray-600">
            Mantente conectado a través de mis redes sociales.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://x.com/_laxarc_"
              className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-300 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 335 276"
                fill="#3ba9ee"
              >
                <path d="m302 70a195 195 0 0 1 -299 175 142 142 0 0 0 97 -30 70 70 0 0 1 -58 -47 70 70 0 0 0 31 -2 70 70 0 0 1 -57 -66 70 70 0 0 0 28 5 70 70 0 0 1 -18 -90 195 195 0 0 0 141 72 67 67 0 0 1 116 -62 117 117 0 0 0 43 -17 65 65 0 0 1 -31 38 117 117 0 0 0 39 -11 65 65 0 0 1 -32 35" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/_laxart_/"
              className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-300 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                className="bi bi-instagram"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
              </svg>
            </a>
          </div>

          {/* Image */}
          <div>
            <img
              src={imgAbout}
              alt="Tienda"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
