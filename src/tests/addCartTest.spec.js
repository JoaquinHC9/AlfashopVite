import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';
import { describe, it, after, before } from 'mocha';

let driver;

describe('Test: agregar item al carrito de compras', function () {
  this.timeout(30000); // Aumentar el tiempo de espera si es necesario

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    await driver.quit();
  });

  it('Debe permitir agregar un producto al carritod e compras', async () => {
    try {
      // Paso 1: Navegar a la página principal
      await driver.get('http://localhost:5173/');
      await driver.sleep(1000);

      // Paso 2: Seleccionar un producto
      const productCard = await driver.findElement(
        By.xpath('//div[contains(@class, "product-card")]//p[text()="Teléfono inteligente con 128GB de almacenamiento"]')
      );
      await driver.wait(until.elementIsVisible(productCard), 10000);
      await productCard.click();
      await driver.sleep(1000);

      // Paso 3: Esperar a que la página del producto cargue
      await driver.wait(until.urlContains('/products/1'), 10000);
      await driver.sleep(1000);

      // Paso 4: Ajustar la cantidad a 3
      const quantityInput = await driver.findElement(By.xpath('//input[@type="number"]'));
      const currentValue = await quantityInput.getAttribute('value');
      if (currentValue !== '3') {
        await quantityInput.clear();
        await driver.sleep(500);
        await quantityInput.sendKeys('3');
      }
      await driver.sleep(1000);

      // Paso 5: Hacer clic en el botón "Agregar al carrito"
      const addToCartButton = await driver.findElement(
        By.xpath('//button[contains(@class, "MuiButton-containedPrimary")]')
      );
      await driver.wait(until.elementIsVisible(addToCartButton), 10000);
      await addToCartButton.click();
      await driver.sleep(1000);

      // Paso 6: Verificar que el producto se ha agregado al localStorage
      const cart = await driver.executeScript('return localStorage.getItem("cart");');
      const cartObject = JSON.parse(cart);
      assert.strictEqual(cartObject.length, 1, 'El carrito no tiene el número correcto de productos.');
      assert.strictEqual(cartObject[0].idProducto, 1, 'El ID del producto no coincide.');
      assert.strictEqual(cartObject[0].cantidad, 3, 'La cantidad del producto no coincide.');

      console.log('Prueba exitosa: Producto agregado al carrito correctamente.');
    } catch (err) {
      console.error('Error durante la prueba:', err);
      throw err;
    }
  });
});
