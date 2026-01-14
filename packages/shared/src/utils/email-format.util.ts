import { NotificationPayloadDto } from '../dtos/notifications/notification-payload.dto';

export class EmailTemplates {
  /**
   * Template para cuando se crea una orden
   */
  static orderCreated(params: NotificationPayloadDto): string {
    const { orderId, total, userId } = params;

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">¡Orden Creada!</h1>
                        </td>
                    </tr>
                    
                    <!-- Icon -->
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <div style="background-color: #f0f4ff; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 11L12 14L22 4" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <p style="margin: 0 0 10px; color: #666666; font-size: 14px; text-align: center;">
                                Hola usuario: ${userId},
                            </p>
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6; text-align: center;">
                                Tu orden ha sido creada exitosamente. Aquí están los detalles:
                            </p>
                            
                            <!-- Order Details Box -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa; border-radius: 6px; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding: 10px 0; color: #666666; font-size: 14px;">Número de Orden:</td>
                                                <td style="padding: 10px 0; color: #333333; font-size: 16px; font-weight: bold; text-align: right;">#${orderId}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0; border-top: 1px solid #e0e0e0; color: #666666; font-size: 14px;">Total:</td>
                                                <td style="padding: 10px 0; border-top: 1px solid #e0e0e0; color: #667eea; font-size: 20px; font-weight: bold; text-align: right;">$${total?.toFixed(2) || '0.00'}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="#" style="background-color: #667eea; color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">Ver Mi Orden</a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 20px 0 0; color: #999999; font-size: 14px; line-height: 1.6; text-align: center;">
                                Te notificaremos cuando tu orden sea procesada.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0 0 10px; color: #999999; font-size: 12px;">
                                © ${new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                ¿Necesitas ayuda? <a href="mailto:soporte@tuempresa.com" style="color: #667eea; text-decoration: none;">Contáctanos</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
  }

  /**
   * Template para cuando un pago es exitoso
   */
  static paymentSuccess(params: NotificationPayloadDto): string {
    const { orderId, paymentId, userId } = params;

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">¡Pago Exitoso!</h1>
                        </td>
                    </tr>
                    
                    <!-- Success Icon -->
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <div style="background-color: #e8f8f5; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="#11998e" stroke-width="2"/>
                                    <path d="M8 12L11 15L16 9" stroke="#11998e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <p style="margin: 0 0 10px; color: #666666; font-size: 14px; text-align: center;">
                                Hola usuario: ${userId},
                            </p>
                            <p style="margin: 0 0 20px; color: #333333; font-size: 18px; line-height: 1.6; text-align: center; font-weight: bold;">
                                Tu pago ha sido procesado correctamente
                            </p>
                            
                            <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6; text-align: center;">
                                Tu orden está confirmada y será procesada en breve.
                            </p>
                            
                            <!-- Payment Details Box -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa; border-radius: 6px; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding: 10px 0; color: #666666; font-size: 14px;">ID de Pago:</td>
                                                <td style="padding: 10px 0; color: #333333; font-size: 14px; font-weight: bold; text-align: right;">${paymentId || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0; border-top: 1px solid #e0e0e0; color: #666666; font-size: 14px;">Número de Orden:</td>
                                                <td style="padding: 10px 0; border-top: 1px solid #e0e0e0; color: #333333; font-size: 16px; font-weight: bold; text-align: right;">#${orderId}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0; border-top: 1px solid #e0e0e0; color: #666666; font-size: 14px;">Estado:</td>
                                                <td style="padding: 10px 0; border-top: 1px solid #e0e0e0; text-align: right;">
                                                    <span style="background-color: #d4edda; color: #155724; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold;">CONFIRMADO</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Info Box -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #e8f8f5; border-left: 4px solid #11998e; border-radius: 4px; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0; color: #0c5c52; font-size: 14px; line-height: 1.6;">
                                            <strong>📦 ¿Qué sigue?</strong><br>
                                            Recibirás una notificación cuando tu orden sea enviada con el número de seguimiento.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Buttons -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                                <tr>
                                    <td align="center" style="padding-bottom: 10px;">
                                        <a href="#" style="background-color: #11998e; color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">Ver Orden</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <a href="#" style="background-color: #ffffff; color: #11998e; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block; border: 2px solid #11998e;">Descargar Recibo</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0 0 10px; color: #999999; font-size: 12px;">
                                © ${new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                ¿Tienes preguntas? <a href="mailto:soporte@tuempresa.com" style="color: #11998e; text-decoration: none;">Contáctanos</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
  }

  /**
   * Template para cuando un pago falla
   */
  static paymentFailed(params: NotificationPayloadDto): string {
    const { orderId, userId, message } = params;
    const reason = message || 'El pago no pudo ser procesado';

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #f85032 0%, #e73827 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Pago No Procesado</h1>
                        </td>
                    </tr>
                    
                    <!-- Warning Icon -->
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <div style="background-color: #ffebee; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="#f85032" stroke-width="2"/>
                                    <path d="M12 8V12" stroke="#f85032" stroke-width="2" stroke-linecap="round"/>
                                    <circle cx="12" cy="16" r="1" fill="#f85032"/>
                                </svg>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <p style="margin: 0 0 10px; color: #666666; font-size: 14px; text-align: center;">
                                Hola usuario: ${userId},
                            </p>
                            <p style="margin: 0 0 20px; color: #333333; font-size: 18px; line-height: 1.6; text-align: center; font-weight: bold;">
                                Hubo un problema con tu pago
                            </p>
                            
                            <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6; text-align: center;">
                                ${reason}
                            </p>
                            
                            <!-- Order Info -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa; border-radius: 6px; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 25px; text-align: center;">
                                        <p style="margin: 0; color: #666666; font-size: 14px;">Orden:</p>
                                        <p style="margin: 10px 0 0; color: #333333; font-size: 18px; font-weight: bold;">#${orderId}</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Info Box -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                                            <strong>💡 Sugerencias:</strong><br>
                                            • Verifica que tu método de pago tenga fondos suficientes<br>
                                            • Confirma que los datos de tu tarjeta sean correctos<br>
                                            • Intenta con otro método de pago
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="#" style="background-color: #f85032; color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">Intentar Nuevamente</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0 0 10px; color: #999999; font-size: 12px;">
                                © ${new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                ¿Necesitas ayuda? <a href="mailto:soporte@tuempresa.com" style="color: #f85032; text-decoration: none;">Contáctanos</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
  }
}