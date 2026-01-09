package hanu.edu.infrastructure.third_party.paypal;

import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import hanu.edu.application.share.ResponseBuilder;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/order/paypal")
public class PaypalController {

    private static final String SUCCESS_URL = "success";
    private static final String CANCEL_URL = "cancel";

    @Value("${paypal.return-base-url:http://localhost:4200}")
    private String defaultReturnBaseUrl;

    @Autowired
    PaypalService service; 
    
    private String getFrontendBaseUrl(HttpServletRequest request) {
        String origin = request.getHeader("Origin");
        if (origin != null && !origin.isBlank()) {
            return origin.replaceAll("/$", "");
        }
        String referer = request.getHeader("Referer");
        if (referer != null && !referer.isBlank()) {
            int lastSlash = referer.lastIndexOf('/');
            if (lastSlash > 8) {
                return referer.substring(0, lastSlash);
            }
            return referer.replaceAll("/$", "");
        }
        return defaultReturnBaseUrl.replaceAll("/$", "");
    }

    @PostMapping("/transfer/{totalPrice}")
    public ResponseEntity<?> payMoney(
            @PathVariable double totalPrice,
            HttpServletRequest request) throws PayPalRESTException {
        String baseUrl = getFrontendBaseUrl(request);
        String cancelUrl = baseUrl + "/" + CANCEL_URL;
        String successUrl = baseUrl + "/" + SUCCESS_URL;
        Payment payment = service.createPayment(
                totalPrice,
                "USD",
                "PAYPAL",
                "sale",
                "Order",
                cancelUrl,
                successUrl);
        return ResponseBuilder.get200ResponseWithData("Payment gotten successfully!", payment.getLinks());
    }
}
