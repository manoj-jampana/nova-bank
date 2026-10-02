package net.javaguides.banking.repository;
import net.javaguides.banking.entity.BankTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface BankTransactionRepository extends JpaRepository<BankTransaction, Long> {
    List<BankTransaction> findByAccountNumberOrderByCreatedAtDesc(String accountNumber);
}
