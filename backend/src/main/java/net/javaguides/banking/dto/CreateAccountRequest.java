package net.javaguides.banking.dto;
import jakarta.validation.constraints.*;
public record CreateAccountRequest(
    @NotBlank @Size(min=3,max=100) String holderName,
    @NotBlank @Email @Size(max=150) String email,
    @NotNull @DecimalMin(value="0.00") @Digits(integer=13,fraction=2) java.math.BigDecimal initialDeposit
) {}
