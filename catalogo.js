const catalogContainer = document.getElementById("catalogContainer");
const catalogTitle = document.getElementById("catalogTitle");

const catalogos = {

    zapatillas: [
        { icon:"👟", modelo:"Runner Pro", marca:"Nike", tallas:[36,37,38,39], precio:"$89.99" },
        { icon:"👟", modelo:"Urban Flex", marca:"Adidas", tallas:[35,36,37,38], precio:"$79.99" }
    ],

    tacones: [
        { icon:"👠", modelo:"Elegance", marca:"BellaStep", tallas:[36,37,38], precio:"$99.99" },
        { icon:"👠", modelo:"Queen Style", marca:"Guess", tallas:[35,36,37], precio:"$109.99" }
    ],

    botas: [
        { icon:"👢", modelo:"Winter Lux", marca:"Timberland", tallas:[37,38,39], precio:"$129.99" },
        { icon:"👢", modelo:"Urban Boot", marca:"Dr. Martens", tallas:[36,37,38], precio:"$139.99" }
    ],

    sandalias: [
        { icon:"👡", modelo:"Summer Light", marca:"Havaianas", tallas:[35,36,37,38], precio:"$39.99" },
        { icon:"👡", modelo:"Beach Walk", marca:"Crocs", tallas:[36,37,38,39], precio:"$49.99" }
    ],

    formales: [
        { icon:"🥿", modelo:"Office Chic", marca:"Aldo", tallas:[36,37,38], precio:"$89.99" },
        { icon:"🥿", modelo:"Classic Lady", marca:"Clarks", tallas:[35,36,37], precio:"$94.99" }
    ],

    infantil: [
        { icon:"👟", modelo:"Mini Runner", marca:"Puma Kids", tallas:[28,29,30], precio:"$34.99" },
        { icon:"👟", modelo:"Princess Fun", marca:"Disney", tallas:[29,30,31], precio:"$39.99" }
    ],

    hogar: [
        { icon:"🥿", modelo:"Soft Home", marca:"BellaStep", tallas:[36,37,38], precio:"$29.99" },
        { icon:"🥿", modelo:"Relax Slipper", marca:"Comfort", tallas:[37,38,39], precio:"$24.99" }
    ],

    invierno: [
        { icon:"❄️", modelo:"Snow Warm", marca:"North Face", tallas:[37,38,39], precio:"$149.99" },
        { icon:"❄️", modelo:"Ice Queen", marca:"Columbia", tallas:[36,37,38], precio:"$139.99" }
    ]
};

const params = new URLSearchParams(window.location.search);
const categoria = params.get("cat") || "zapatillas";

catalogTitle.innerText = categoria.toUpperCase();

(catalogos[categoria] || []).forEach(p => {

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
        <div class="product-image">${p.icon}</div>
        <div class="product-info">
            <h3>${p.modelo}</h3>
            <p><strong>Marca:</strong> ${p.marca}</p>
            <div>${p.tallas.map(t => `<span class="size">${t}</span>`).join("")}</div>
            <div class="price">${p.precio}</div>
            <button class="btn-product">Ver detalle</button>
        </div>
    `;

    catalogContainer.appendChild(card);
});
