package net.javaguides.banking.service;

import net.javaguides.banking.dto.*;
import net.javaguides.banking.entity.*;
import net.javaguides.banking.exception.BankingException;
import net.javaguides.banking.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class BankingService {
    private final AccountRepository accounts;
    private final BankTransactionRepository transactions;
    public BankingService(AccountRepository accounts, BankTransactionRepository transactions) { this.accounts=accounts; this.transactions=transactions; }

    @Transactional
    public Account createAccount(CreateAccountRequest r) {
        if (accounts.existsByEmail(r.email())) throw new BankingException("Email already registered");
        Account a = new Account();
        a.setAccountNumber(generateAccountNumber()); a.setHolderName(r.holderName().trim()); a.setEmail(r.email().trim()); a.setBalance(r.initialDeposit());
        Account saved=accounts.save(a);
        if (r.initialDeposit().compareTo(BigDecimal.ZERO)>0) saveTxn(saved, null, BankTransaction.Type.DEPOSIT, r.initialDeposit(), "Initial deposit");
        return saved;
    }
    public List<Account> getAllAccounts() { return accounts.findAll(); }
    public Account getAccount(String number) { return find(number); }
    @Transactional
    public Account deposit(String number, BigDecimal amount) { Account a=find(number); a.setBalance(a.getBalance().add(amount)); Account s=accounts.save(a); saveTxn(s,null,BankTransaction.Type.DEPOSIT,amount,"Cash deposit"); return s; }
    @Transactional
    public Account withdraw(String number, BigDecimal amount) { Account a=find(number); ensureBalance(a,amount); a.setBalance(a.getBalance().subtract(amount)); Account s=accounts.save(a); saveTxn(s,null,BankTransaction.Type.WITHDRAW,amount,"Cash withdrawal"); return s; }
    @Transactional
    public void transfer(TransferRequest r) {
        if (r.fromAccount().equals(r.toAccount())) throw new BankingException("Source and destination accounts must be different");
        Account from=find(r.fromAccount()), to=find(r.toAccount()); ensureBalance(from,r.amount());
        from.setBalance(from.getBalance().subtract(r.amount())); to.setBalance(to.getBalance().add(r.amount())); accounts.save(from); accounts.save(to);
        saveTxn(from,to.getAccountNumber(),BankTransaction.Type.TRANSFER_OUT,r.amount(),"Transfer to "+to.getAccountNumber());
        saveTxn(to,from.getAccountNumber(),BankTransaction.Type.TRANSFER_IN,r.amount(),"Transfer from "+from.getAccountNumber());
    }
    public List<BankTransaction> history(String number) { find(number); return transactions.findByAccountNumberOrderByCreatedAtDesc(number); }
    @Transactional public void deleteAccount(String number) { Account a=find(number); if(a.getBalance().compareTo(BigDecimal.ZERO)!=0) throw new BankingException("Account balance must be zero before closing"); accounts.delete(a); }
    private Account find(String n){ return accounts.findByAccountNumber(n).orElseThrow(()->new BankingException("Account not found: "+n)); }
    private void ensureBalance(Account a, BigDecimal amount){ if(a.getBalance().compareTo(amount)<0) throw new BankingException("Insufficient balance"); }
    private void saveTxn(Account a,String related,BankTransaction.Type type,BigDecimal amount,String desc){ BankTransaction t=new BankTransaction(); t.setAccountNumber(a.getAccountNumber()); t.setRelatedAccountNumber(related); t.setType(type); t.setAmount(amount); t.setBalanceAfter(a.getBalance()); t.setDescription(desc); transactions.save(t); }
    private String generateAccountNumber(){ String n; do { n=String.valueOf(ThreadLocalRandom.current().nextLong(1000000000L,9999999999L)); } while(accounts.findByAccountNumber(n).isPresent()); return n; }
}
