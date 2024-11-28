import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert'; // Valida con ES Modules
import { describe, it, before, after } from 'mocha';

describe('Pruebas de Registro', function () {
    this.timeout(30000); // Establece un tiempo máximo de espera para cada prueba
    let driver;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {
        await driver.quit();
    });

    it('Debe completar el formulario de registro y mostrar un mensaje de éxito', async () => {
        try {
            // Abre la aplicación en la ruta del componente Register
            await driver.get('http://localhost:5173/register'); // Cambia la URL según tu configuración

            // Completa los campos del formulario
            await driver.findElement(By.name('nombre')).sendKeys('John');
            await driver.findElement(By.name('apellido')).sendKeys('Doe');
            await driver.findElement(By.name('email')).sendKeys('johndoe696@example.com');
            await driver.findElement(By.name('contrasena')).sendKeys('password123');
            await driver.findElement(By.name('telefono')).sendKeys('1234567890');

            // Abre el calendario de Material-UI
            const calendarButton = await driver.findElement(
                By.xpath('//button[@aria-label="Choose new calendar date"]')
            );
            await calendarButton.click();

            // Espera a que se cargue el menú del calendario
            await driver.wait(until.elementLocated(By.className('MuiPickersDay-root')), 5000);

            // Selecciona el día específico (por ejemplo, el día 22)
            const dayButton = await driver.findElement(By.xpath('//button[@data-timestamp="1732251600000"]'));
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
        } catch (err) {
            throw new Error('Error durante la prueba: ' + err.message);
        }
    });
});
