import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert'; // Valida con ES Modules
import { describe, it, after, before } from 'mocha';

describe('Pruebas de Login Modal', function () {
    this.timeout(30000); // Establece un tiempo máximo de espera para cada prueba (30 segundos)
    let driver;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {
        await driver.quit();
    });

    it('Debe realizar login exitosamente y mostrar mensaje de éxito', async () => {
        try {
            // Navega a la aplicación
            await driver.get('http://localhost:5173/'); // Cambia la URL según tu configuración

            // Haz clic en el botón "Login" para abrir el modal
            const loginButton = await driver.findElement(By.xpath('//button[text()="Login"]'));
            await driver.wait(until.elementIsVisible(loginButton), 15000);
            await loginButton.click();

            // Espera a que el modal se abra buscando el contenedor con la clase "MuiBox-root"
            const modal = await driver.wait(
                until.elementLocated(By.xpath('//div[contains(@class, "MuiBox-root") and contains(@class, "css-1wnsr1i")]')),
                5000
            );

            // Rellena el campo "Usuario"
            const userField = await modal.findElement(By.xpath('//input[@type="text"]'));
            await userField.sendKeys('joaquin@correo.com');

            // Rellena el campo "Contraseña"
            const passwordField = await modal.findElement(By.xpath('//input[@type="password"]'));
            await passwordField.sendKeys('j@123');

            // Haz clic en el botón "Iniciar sesión"
            const submitButton = await modal.findElement(By.xpath('//button[text()="Iniciar sesión"]'));
            await driver.wait(until.elementIsVisible(submitButton), 10000);
            await driver.executeScript("arguments[0].click();", submitButton);

            // Espera a que aparezca el mensaje de éxito (Toast)
            const successToast = await driver.wait(
                until.elementLocated(By.xpath('//div[contains(@class, "Toastify__toast--success")]')),
                10000
            );
            await driver.sleep(1000);
            // Verifica el contenido del mensaje
            const toastMessage = await successToast.getText();
            assert.strictEqual(toastMessage, 'Login Exitoso');
        } catch (err) {
            throw new Error('Error durante la prueba: ' + err.message);
        }
    });
});
