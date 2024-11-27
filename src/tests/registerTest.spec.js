import { Builder, By, until, Key } from 'selenium-webdriver';
import assert from 'assert'; // Valida con ES Modules

(async function testRegisterForm() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Abre tu aplicación en la ruta del componente Register
        await driver.get('http://localhost:5173/register'); // Cambia la URL según tu configuración

        // Completa los campos del formulario
        await driver.findElement(By.name('nombre')).sendKeys('John');
        await driver.findElement(By.name('apellido')).sendKeys('Doe');
        await driver.findElement(By.name('email')).sendKeys('johndoe6@example.com');
        await driver.findElement(By.name('contrasena')).sendKeys('password123');
        await driver.findElement(By.name('telefono')).sendKeys('1234567890');

        // Abre el calendario de Material-UI
        const calendarButton = await driver.findElement(
            By.xpath('//button[@aria-label="Choose date, selected date is Nov 26, 2024"]')
        );
        await calendarButton.click();

        // Espera a que se cargue el menú del calendario
        await driver.wait(
            until.elementLocated(By.className('MuiPickersDay-root')),
            5000
        );

        // Selecciona el día específico (por ejemplo, el día 22)
        const dayButton = await driver.findElement(
            By.xpath('//button[@data-timestamp="1732251600000"]')
        );
        await dayButton.click();

        // Haz clic en el botón de registro
        const registerButton = await driver.findElement(By.xpath('//button[text()="Registrarse"]'));
        await registerButton.click();

        // Espera y valida el mensaje de éxito en el elemento <h2>
        const successMessage = await driver.wait(
            until.elementLocated(By.xpath('//h2[@id="swal2-title" and text()="Registro exitoso"]')),
            5000
        );
        const messageText = await successMessage.getText();
        assert.strictEqual(messageText, 'Registro exitoso');
        console.log('Prueba exitosa: El registro funcionó correctamente.');
        
    } catch (err) {
        console.error('Error durante la prueba:', err);
    } finally {
        // Cierra el navegador
        await driver.quit();
    }
})();
