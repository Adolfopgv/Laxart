import imgSobreProyecto from "../assets/about_img/laxart_info.jpg";
import img1 from "../assets/about_img/img1_about.jpg";
import img2 from "../assets/about_img/img2_about.jpg";

export default function About() {
  return (
    <div className="flex flex-col items-center space-y-8 p-4 md:p-8">
      <img
        src={imgSobreProyecto}
        alt="!Hola! Soy Clara, la artesana detrás de este pequeño proyecto. En esta tienda encontrarás joyería y complementos (generalmente de temática friki) impresos en 3D. Concretamente en PLA. Un material biodegradable y no tóxico. Todos los productos están modelados, procesados y pintados por mí con mucho cariño e ilusión. Espero que os gusten tanto como a mí"
        className="w-full rounded-lg shadow-lg mb-8"
      />
      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
        <img
          src={img1}
          alt="Imagen 1"
          className="w-full md:w-1/2 rounded-lg shadow-lg"
        />
        <img
          src={img2}
          alt="Imagen 2"
          className="w-full md:w-1/2 rounded-lg shadow-lg"
        />
      </div>
      <footer className="text-center mt-8">
        <p className="text-lg font-bold">
          Página web desarrollada por Adolfo Pérez-Gascón Valls
        </p>
      </footer>
    </div>
  );
}
