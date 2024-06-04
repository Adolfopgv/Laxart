import important from "../assets/about_img/importante.png";

export default function Legal() {
  return (
    <div className="max-w-xl mx-auto p-4 md:p-8">
      <img
        src={important}
        alt="importante"
        className=" top-0"
      />
      <div className="p-6 rounded-lg shadow-lg">
        <ul className="space-y-4 list-disc list-inside">
          <li>
            Laxart no se responsabiliza de la pérdida de ningún pedido. Los
            envíos sin seguimiento tienen un coste menor pero existe el riesgo
            de perderse y es el comprador el que se hace responsable de ello al
            escoger dicha opción de envío. Para los envíos con seguimiento que
            se pierdan debe consultarse a la empresa de transporte y no
            contactar conmigo, pues no puedo solucionar nada.
          </li>
          <li>
            Deberá pagarse el pedido completo o no podrá ser enviado. En ninguna
            circunstancia se abonará el pago posteriormente.
          </li>
          <li>
            Laxart no se hace responsable de cualquier desperfecto en los
            productos proveniente del trato a los paquetes por parte las
            empresas de envíos. Es responsabilidad de la propia empresa de
            envíos.
          </li>
          <li>
            Existe la opción de recoger en mano el pedido únicamente si se
            recoge en Málaga en las zonas "Vialia/Estación María Zambrano" o
            "Alameda Principal".
          </li>
          <li>
            Se aceptan como pago paypal, bizum o tarjeta de crédito. Si alguna
            de las opciones no aparece disponible en la web, contacta en el
            formulario o por la cuenta de la tienda en instagram.
          </li>
          <li>
            No se aceptan pedidos personalizados. Únicamente podrán pedirse los
            artículos disponibles en la tienda online o en la tienda de
            instagram. Aun así, es posible proponer sugerencias a través del
            formulario de contacto.
          </li>
          <li>
            Los pedidos pueden tardar varios días en prepararse y Laxart no se
            responsabiliza del tiempo estimado de envío. Especialmente cuando el
            envío del pedido es sin seguimiento.
          </li>
        </ul>
      </div>
    </div>
  );
}
