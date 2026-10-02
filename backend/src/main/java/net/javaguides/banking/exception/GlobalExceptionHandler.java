package net.javaguides.banking.exception;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.stream.Collectors;
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BankingException.class)
    ResponseEntity<?> banking(BankingException e) { return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage())); }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<?> validation(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream().map(x -> x.getField()+": "+x.getDefaultMessage()).collect(Collectors.joining(", "));
        return ResponseEntity.badRequest().body(new ErrorResponse(msg));
    }
    @ExceptionHandler(Exception.class)
    ResponseEntity<?> general(Exception e) { return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Unexpected server error")); }
    record ErrorResponse(String message, LocalDateTime timestamp) { ErrorResponse(String m) { this(m, LocalDateTime.now()); } }
}
