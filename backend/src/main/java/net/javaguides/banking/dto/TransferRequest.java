package net.javaguides.banking.dto;
import jakarta.validation.constraints.*;
public record TransferRequest(@NotBlank String fromAccount, @NotBlank String toAccount,
    @NotNull @DecimalMin(value="0.01") @Digits(integer=13,fraction=2) java.math.BigDecimal amount) {}
