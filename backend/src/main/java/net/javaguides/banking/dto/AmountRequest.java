package net.javaguides.banking.dto;
import jakarta.validation.constraints.*;
public record AmountRequest(@NotNull @DecimalMin(value="0.01") @Digits(integer=13,fraction=2) java.math.BigDecimal amount) {}
