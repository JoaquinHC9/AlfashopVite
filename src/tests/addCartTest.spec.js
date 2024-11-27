import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert'; // Valida con ES Modules

(async function testAddToCart() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Paso 1: Navegar a la página principal
        await driver.get('http://localhost:5173/');
        await driver.sleep(1000);

        // Paso 2: Seleccionar un producto (por ejemplo, Smartphone)
        const productCard = await driver.findElement(By.xpath('//div[contains(@class, "product-card")]//p[text()="Teléfono inteligente con 128GB de almacenamiento"]'));
        await driver.wait(until.elementIsVisible(productCard), 10000);
        await productCard.click(); // Hacer clic en el producto para ir a la página de detalles
        await driver.sleep(1000);

        // Paso 3: Esperar a que la página del producto cargue
        await driver.wait(until.urlContains('/products/1'), 10000); // Asegurarse de que se cargó la página de producto
        await driver.sleep(1000);

        // Paso 4: Ajustar la cantidad a 3
        const quantityInput = await driver.findElement(By.xpath('//input[@type="number"]'));
        await driver.sleep(1000);
        
        // Asegurarse de que el campo esté vacío antes de ingresar el nuevo valor
        const currentValue = await quantityInput.getAttribute('value');
        if (currentValue !== '3') {
            await quantityInput.clear();
            await driver.sleep(500);
            await quantityInput.sendKeys('3');
        }
        
        await driver.sleep(1000); // Esperar un poco para que el valor se registre

        // Paso 5: Hacer clic en el botón "Agregar al carrito"
        const addToCartButton = await driver.findElement(By.xpath('//button[contains(@class, "MuiButton-containedPrimary")]'));
        await driver.wait(until.elementIsVisible(addToCartButton), 10000);
        await addToCartButton.click(); // Hacer clic en el botón de agregar al carrito
        await driver.sleep(1000);

        // Paso 6: Verificar que el producto se ha agregado al localStorage
        const cart = await driver.executeScript('return localStorage.getItem("cart");'); // Obtener el carrito desde localStorage
        const cartObject = JSON.parse(cart); // Convertir el carrito en un objeto
        await driver.sleep(1000);

        // Verificar que el carrito contiene el producto correcto con la cantidad correcta
        assert.strictEqual(cartObject.length, 1); // Asegurarse de que solo hay un producto en el carrito
        assert.strictEqual(cartObject[0].idProducto, 1); // Verificar que el producto es el correcto (id 1)
        assert.strictEqual(cartObject[0].cantidad, 3); // Verificar que la cantidad es 3
        await driver.sleep(1000);

        console.log('Prueba exitosa: Producto agregado al carrito correctamente.');

    } catch (err) {
        console.error('Error durante la prueba:', err);
    } finally {
        // Cierra el navegador
        await driver.quit();
    }
})();
