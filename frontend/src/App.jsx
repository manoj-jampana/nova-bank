import { useState, useEffect } from "react";


/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */

function AdminDashboard({ user, logout }) {

  const [page, setPage] = useState("dashboard");

  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  /* =========================================================
     LOAD USERS
     ========================================================= */

  async function loadUsers() {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
          "http://localhost:8080/api/auth/users"
      );

      if (!response.ok) {
        throw new Error("Failed to load users");
      }

      const data = await response.json();

      setUsers(data);
      setTotalUsers(data.length);

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  }


  /* =========================================================
     LOAD ACCOUNTS
     ========================================================= */

  async function loadAccounts() {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
          "http://localhost:8080/api/accounts"
      );

      if (!response.ok) {
        throw new Error("Failed to load accounts");
      }

      const data = await response.json();

      setAccounts(data);
      setTotalAccounts(data.length);

      const balance = data.reduce(
          (sum, account) =>
              sum + Number(account.balance || 0),
          0
      );

      setTotalBalance(balance);

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  }


  /* =========================================================
     LOAD TRANSACTIONS
     ========================================================= */

  async function loadTransactions() {

    try {

      setLoading(true);
      setError("");

      let currentAccounts = accounts;

      /*
       * If accounts are not already loaded,
       * load them first.
       */

      if (currentAccounts.length === 0) {

        const accountsResponse = await fetch(
            "http://localhost:8080/api/accounts"
        );

        if (!accountsResponse.ok) {
          throw new Error("Failed to load accounts");
        }

        currentAccounts =
            await accountsResponse.json();

        setAccounts(currentAccounts);
        setTotalAccounts(currentAccounts.length);
      }


      /*
       * Get transactions for every account.
       */

      const results = await Promise.all(

          currentAccounts.map(async (account) => {

            try {

              const response = await fetch(
                  `http://localhost:8080/api/accounts/${account.accountNumber}/transactions`
              );

              if (!response.ok) {
                return [];
              }

              return await response.json();

            } catch {

              return [];

            }

          })

      );


      const allTransactions = results.flat();

      setTransactions(allTransactions);

      setTotalTransactions(
          allTransactions.length
      );

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  }


  /* =========================================================
     LOAD ALL DASHBOARD DATA
     ========================================================= */

  async function loadDashboardStats() {

    try {

      setLoading(true);
      setError("");

      /*
       * USERS
       */

      const usersResponse = await fetch(
          "http://localhost:8080/api/auth/users"
      );

      if (!usersResponse.ok) {
        throw new Error("Failed to load users");
      }

      const usersData =
          await usersResponse.json();

      setUsers(usersData);
      setTotalUsers(usersData.length);


      /*
       * ACCOUNTS
       */

      const accountsResponse = await fetch(
          "http://localhost:8080/api/accounts"
      );

      if (!accountsResponse.ok) {
        throw new Error("Failed to load accounts");
      }

      const accountsData =
          await accountsResponse.json();

      setAccounts(accountsData);
      setTotalAccounts(accountsData.length);


      /*
       * BALANCE
       */

      const balance = accountsData.reduce(
          (sum, account) =>
              sum + Number(account.balance || 0),
          0
      );

      setTotalBalance(balance);


      /*
       * TRANSACTIONS
       */

      const results = await Promise.all(

          accountsData.map(async (account) => {

            try {

              const response = await fetch(
                  `http://localhost:8080/api/accounts/${account.accountNumber}/transactions`
              );

              if (!response.ok) {
                return [];
              }

              return await response.json();

            } catch {

              return [];

            }

          })

      );

      const allTransactions = results.flat();

      setTransactions(allTransactions);

      setTotalTransactions(
          allTransactions.length
      );

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  }


  /* =========================================================
     LOAD ADMIN DASHBOARD ON LOGIN
     ========================================================= */

  useEffect(() => {

    loadDashboardStats();

  }, []);


  /* =========================================================
     NAVIGATION
     ========================================================= */

  async function openDashboard() {

    setPage("dashboard");
    setError("");

    await loadDashboardStats();

  }


  async function openUsers() {

    setPage("users");
    setError("");

    await loadUsers();

  }


  async function openAccounts() {

    setPage("accounts");
    setError("");

    await loadAccounts();

  }


  async function openTransactions() {

    setPage("transactions");
    setError("");

    await loadTransactions();

  }


  function openSettings() {

    setPage("settings");
    setError("");

  }


  /* =========================================================
     ADMIN UI
     ========================================================= */

  return (

      <div className="admin-layout">

        {/* SIDEBAR */}

        <aside className="sidebar">

          <div className="logo">
            🏦 <span>Nova</span>Bank
          </div>

          <p className="nav-title">
            Main Menu
          </p>


          <button
              className={`nav-button ${
                  page === "dashboard"
                      ? "active"
                      : ""
              }`}
              onClick={openDashboard}
          >
            📊 Dashboard
          </button>


          <button
              className={`nav-button ${
                  page === "users"
                      ? "active"
                      : ""
              }`}
              onClick={openUsers}
          >
            👥 Users
          </button>


          <button
              className={`nav-button ${
                  page === "accounts"
                      ? "active"
                      : ""
              }`}
              onClick={openAccounts}
          >
            🏦 Accounts
          </button>


          <button
              className={`nav-button ${
                  page === "transactions"
                      ? "active"
                      : ""
              }`}
              onClick={openTransactions}
          >
            💳 Transactions
          </button>


          <p className="nav-title">
            System
          </p>


          <button
              className={`nav-button ${
                  page === "settings"
                      ? "active"
                      : ""
              }`}
              onClick={openSettings}
          >
            ⚙️ Settings
          </button>

        </aside>


        {/* MAIN */}

        <div className="admin-main">

          {/* TOPBAR */}

          <header className="topbar">

            <div className="topbar-title">

              {page === "dashboard" &&
                  "Admin Dashboard"}

              {page === "users" &&
                  "Users"}

              {page === "accounts" &&
                  "Accounts"}

              {page === "transactions" &&
                  "Transactions"}

              {page === "settings" &&
                  "Settings"}

            </div>


            <div className="admin-profile">

              <div className="avatar">

                {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : "A"}

              </div>


              <div>

                <div className="profile-name">
                  {user.name}
                </div>

                <div className="profile-role">
                  Administrator
                </div>

              </div>


              <button
                  className="logout-button"
                  onClick={logout}
              >
                Logout
              </button>

            </div>

          </header>


          {/* CONTENT */}

          <main className="dashboard-content">


            {/* =================================================
               DASHBOARD
               ================================================= */}

            {page === "dashboard" && (

                <>

                  <div className="welcome">

                    <h1>
                      Welcome back, {user.name} 👋
                    </h1>

                    <p>
                      Here's what's happening with NovaBank today.
                    </p>

                  </div>


                  <div className="stats-grid">


                    <div className="stat-card">

                      <div className="stat-top">

                        <strong>
                          Users
                        </strong>

                        <div className="stat-icon">
                          👥
                        </div>

                      </div>

                      <div className="stat-label">
                        Total registered users
                      </div>

                      <div className="stat-value">
                        {totalUsers}
                      </div>

                    </div>


                    <div className="stat-card">

                      <div className="stat-top">

                        <strong>
                          Accounts
                        </strong>

                        <div className="stat-icon">
                          🏦
                        </div>

                      </div>

                      <div className="stat-label">
                        Active bank accounts
                      </div>

                      <div className="stat-value">
                        {totalAccounts}
                      </div>

                    </div>


                    <div className="stat-card">

                      <div className="stat-top">

                        <strong>
                          Balance
                        </strong>

                        <div className="stat-icon">
                          💰
                        </div>

                      </div>

                      <div className="stat-label">
                        Total bank balance
                      </div>

                      <div className="stat-value">
                        ₹ {totalBalance.toFixed(2)}
                      </div>

                    </div>


                    <div className="stat-card">

                      <div className="stat-top">

                        <strong>
                          Transactions
                        </strong>

                        <div className="stat-icon">
                          💳
                        </div>

                      </div>

                      <div className="stat-label">
                        Total transactions
                      </div>

                      <div className="stat-value">
                        {totalTransactions}
                      </div>

                    </div>

                  </div>


                  <section className="section">

                    <div className="section-header">

                      <h2>
                        Quick Actions
                      </h2>

                    </div>


                    <div className="action-grid">


                      <button
                          className="action-card"
                          onClick={openUsers}
                      >

                        <div className="action-icon">
                          👥
                        </div>

                        <div className="action-title">
                          View All Users
                        </div>

                        <div className="action-description">
                          Manage registered customers
                        </div>

                      </button>


                      <button
                          className="action-card"
                          onClick={openAccounts}
                      >

                        <div className="action-icon">
                          🏦
                        </div>

                        <div className="action-title">
                          View All Accounts
                        </div>

                        <div className="action-description">
                          View customer bank accounts
                        </div>

                      </button>


                      <button
                          className="action-card"
                          onClick={openTransactions}
                      >

                        <div className="action-icon">
                          💳
                        </div>

                        <div className="action-title">
                          View Transactions
                        </div>

                        <div className="action-description">
                          Monitor banking activity
                        </div>

                      </button>

                    </div>

                  </section>

                </>

            )}


            {/* ERROR */}

            {error && (

                <p className="error">
                  {error}
                </p>

            )}


            {/* LOADING */}

            {loading && (

                <p>
                  Loading...
                </p>

            )}


            {/* =================================================
               USERS
               ================================================= */}

            {page === "users" && (

                <section className="section">

                  <div className="section-header">

                    <div>

                      <h2>
                        All Users
                      </h2>

                      <p>
                        Manage registered NovaBank users
                      </p>

                    </div>

                  </div>


                  <div className="table-container">

                    <table className="data-table">

                      <thead>

                      <tr>

                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>

                      </tr>

                      </thead>


                      <tbody>

                      {users.map((u) => (

                          <tr key={u.id}>

                            <td>
                              {u.id}
                            </td>

                            <td>
                              {u.name}
                            </td>

                            <td>
                              {u.email}
                            </td>

                            <td>
                              {u.role}
                            </td>

                          </tr>

                      ))}

                      </tbody>

                    </table>

                  </div>

                </section>

            )}


            {/* =================================================
               ACCOUNTS
               ================================================= */}

            {page === "accounts" && (

                <section className="section">

                  <div className="section-header">

                    <div>

                      <h2>
                        All Accounts
                      </h2>

                      <p>
                        Manage and monitor customer bank accounts
                      </p>

                    </div>

                  </div>


                  <div className="table-container">

                    <table className="data-table">

                      <thead>

                      <tr>

                        <th>Account Number</th>
                        <th>Holder Name</th>
                        <th>Email</th>
                        <th>Balance</th>

                      </tr>

                      </thead>


                      <tbody>

                      {accounts.map((account) => (

                          <tr key={account.accountNumber}>

                            <td>
                              <strong>
                                {account.accountNumber}
                              </strong>
                            </td>

                            <td>
                              {account.holderName}
                            </td>

                            <td>
                              {account.email}
                            </td>

                            <td>
                              ₹{" "}
                              {Number(
                                  account.balance || 0
                              ).toFixed(2)}
                            </td>

                          </tr>

                      ))}

                      </tbody>

                    </table>

                  </div>

                </section>

            )}


            {/* =================================================
               TRANSACTIONS
               ================================================= */}

            {page === "transactions" && (

                <section className="section">

                  <div className="section-header">

                    <div>

                      <h2>
                        All Transactions
                      </h2>

                      <p>
                        Monitor NovaBank banking activity
                      </p>

                    </div>

                  </div>


                  <div className="table-container">

                    <table className="data-table">

                      <thead>

                      <tr>

                        <th>ID</th>
                        <th>Account</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Balance After</th>
                        <th>Description</th>
                        <th>Date</th>

                      </tr>

                      </thead>


                      <tbody>

                      {transactions.map((transaction) => (

                          <tr key={transaction.id}>

                            <td>
                              {transaction.id}
                            </td>

                            <td>
                              {transaction.accountNumber}
                            </td>

                            <td>
                              {transaction.type}
                            </td>

                            <td>
                              ₹{" "}
                              {Number(
                                  transaction.amount || 0
                              ).toFixed(2)}
                            </td>

                            <td>
                              ₹{" "}
                              {Number(
                                  transaction.balanceAfter || 0
                              ).toFixed(2)}
                            </td>

                            <td>
                              {transaction.description}
                            </td>

                            <td>
                              {transaction.createdAt
                                  ? new Date(
                                      transaction.createdAt
                                  ).toLocaleString()
                                  : "-"}
                            </td>

                          </tr>

                      ))}

                      </tbody>

                    </table>

                  </div>

                </section>

            )}


            {/* =================================================
               SETTINGS
               ================================================= */}

            {page === "settings" && (

                <section className="section">

                  <div className="welcome">

                    <h1>
                      ⚙️ Settings
                    </h1>

                    <p>
                      Manage your administrator profile.
                    </p>

                  </div>


                  <div className="table-container">

                    <table className="data-table">

                      <tbody>

                      <tr>

                        <th>
                          Name
                        </th>

                        <td>
                          {user.name}
                        </td>

                      </tr>


                      <tr>

                        <th>
                          Email
                        </th>

                        <td>
                          {user.email}
                        </td>

                      </tr>


                      <tr>

                        <th>
                          Role
                        </th>

                        <td>
                          {user.role}
                        </td>

                      </tr>

                      </tbody>

                    </table>

                  </div>

                </section>

            )}

          </main>

        </div>

      </div>
  );
}


/* =========================================================
   USER DASHBOARD
   ========================================================= */

function UserDashboard({ user, logout }) {

  const [page, setPage] = useState("dashboard");

  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [amount, setAmount] = useState("");
  const [toAccount, setToAccount] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  /* =========================================================
     LOAD USER ACCOUNT
     ========================================================= */

  async function loadAccount() {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
          "http://localhost:8080/api/accounts"
      );

      if (!response.ok) {
        throw new Error("Failed to load account");
      }

      const data = await response.json();


      /*
       * Find account using logged-in user's email.
       */

      const userAccount = data.find(
          (a) =>
              a.email &&
              a.email.toLowerCase() ===
              user.email.toLowerCase()
      );


      if (!userAccount) {

        setAccount(null);

        throw new Error(
            "No bank account found for this user"
        );

      }


      setAccount(userAccount);

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  }


  /* =========================================================
     LOAD TRANSACTIONS
     ========================================================= */

  async function loadTransactions() {

    try {

      if (!account) {

        await loadAccount();

        return;

      }

      setLoading(true);
      setError("");

      const response = await fetch(
          `http://localhost:8080/api/accounts/${account.accountNumber}/transactions`
      );

      if (!response.ok) {
        throw new Error(
            "Failed to load transaction history"
        );
      }

      const data = await response.json();

      setTransactions(data);

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  }


  /* =========================================================
     INITIAL LOAD
     ========================================================= */

  useEffect(() => {

    loadAccount();

  }, [user.email]);


  /* =========================================================
     DEPOSIT
     ========================================================= */

  async function deposit() {

    if (!account) {

      setError("Bank account not found");
      return;

    }


    if (!amount || Number(amount) <= 0) {

      setError("Enter a valid amount");
      return;

    }


    try {

      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
          `http://localhost:8080/api/accounts/${account.accountNumber}/deposit`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({
              amount: Number(amount)
            })

          }
      );


      if (!response.ok) {

        const text = await response.text();

        throw new Error(
            text || "Deposit failed"
        );

      }


      const updatedAccount =
          await response.json();

      setAccount(updatedAccount);

      setAmount("");

      setMessage(
          "Money deposited successfully."
      );

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  }


  /* =========================================================
     WITHDRAW
     ========================================================= */

  async function withdraw() {

    if (!account) {

      setError("Bank account not found");
      return;

    }


    if (!amount || Number(amount) <= 0) {

      setError("Enter a valid amount");
      return;

    }


    try {

      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
          `http://localhost:8080/api/accounts/${account.accountNumber}/withdraw`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({
              amount: Number(amount)
            })

          }
      );


      if (!response.ok) {

        const text = await response.text();

        throw new Error(
            text || "Withdrawal failed"
        );

      }


      const updatedAccount =
          await response.json();

      setAccount(updatedAccount);

      setAmount("");

      setMessage(
          "Money withdrawn successfully."
      );

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  }


  /* =========================================================
     TRANSFER
     ========================================================= */

  async function transfer() {

    if (!account) {

      setError("Bank account not found");
      return;

    }


    if (!toAccount) {

      setError("Enter destination account number");
      return;

    }


    if (!amount || Number(amount) <= 0) {

      setError("Enter a valid amount");
      return;

    }


    if (
        toAccount ===
        account.accountNumber
    ) {

      setError(
          "You cannot transfer to the same account"
      );

      return;

    }


    try {

      setLoading(true);
      setError("");
      setMessage("");


      const response = await fetch(
          "http://localhost:8080/api/transfers",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({

              fromAccount:
              account.accountNumber,

              toAccount:
              toAccount,

              amount:
                  Number(amount)

            })

          }
      );


      if (!response.ok) {

        const text = await response.text();

        throw new Error(
            text || "Transfer failed"
        );

      }


      /*
       * Reload account because balance changed.
       */

      await loadAccount();

      setAmount("");
      setToAccount("");

      setMessage(
          "Money transferred successfully."
      );

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  }


  /* =========================================================
     PAGE NAVIGATION
     ========================================================= */

  async function openDashboard() {

    setPage("dashboard");
    setMessage("");
    setError("");

    await loadAccount();

  }


  async function openTransactions() {

    setPage("transactions");
    setMessage("");
    setError("");

    await loadAccount();

  }


  function openDeposit() {

    setPage("deposit");
    setMessage("");
    setError("");
    setAmount("");

  }


  function openWithdraw() {

    setPage("withdraw");
    setMessage("");
    setError("");
    setAmount("");

  }


  function openTransfer() {

    setPage("transfer");
    setMessage("");
    setError("");
    setAmount("");
    setToAccount("");

  }


  function openProfile() {

    setPage("profile");
    setMessage("");
    setError("");

  }


  /* =========================================================
     USER UI
     ========================================================= */

  return (

      <div className="admin-layout">

        {/* SIDEBAR */}

        <aside className="sidebar">

          <div className="logo">
            🏦 <span>Nova</span>Bank
          </div>


          <p className="nav-title">
            Banking
          </p>


          <button
              className={`nav-button ${
                  page === "dashboard"
                      ? "active"
                      : ""
              }`}
              onClick={openDashboard}
          >
            📊 Dashboard
          </button>


          <button
              className={`nav-button ${
                  page === "deposit"
                      ? "active"
                      : ""
              }`}
              onClick={openDeposit}
          >
            💰 Deposit
          </button>


          <button
              className={`nav-button ${
                  page === "withdraw"
                      ? "active"
                      : ""
              }`}
              onClick={openWithdraw}
          >
            💸 Withdraw
          </button>


          <button
              className={`nav-button ${
                  page === "transfer"
                      ? "active"
                      : ""
              }`}
              onClick={openTransfer}
          >
            ↔️ Transfer
          </button>


          <button
              className={`nav-button ${
                  page === "transactions"
                      ? "active"
                      : ""
              }`}
              onClick={openTransactions}
          >
            📜 Transactions
          </button>


          <p className="nav-title">
            Account
          </p>


          <button
              className={`nav-button ${
                  page === "profile"
                      ? "active"
                      : ""
              }`}
              onClick={openProfile}
          >
            👤 Profile
          </button>

        </aside>


        {/* MAIN */}

        <div className="admin-main">


          {/* TOPBAR */}

          <header className="topbar">

            <div className="topbar-title">

              {page === "dashboard" &&
                  "User Dashboard"}

              {page === "deposit" &&
                  "Deposit Money"}

              {page === "withdraw" &&
                  "Withdraw Money"}

              {page === "transfer" &&
                  "Transfer Money"}

              {page === "transactions" &&
                  "Transaction History"}

              {page === "profile" &&
                  "My Profile"}

            </div>


            <div className="admin-profile">

              <div className="avatar">

                {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : "U"}

              </div>


              <div>

                <div className="profile-name">
                  {user.name}
                </div>

                <div className="profile-role">
                  Customer
                </div>

              </div>


              <button
                  className="logout-button"
                  onClick={logout}
              >
                Logout
              </button>

            </div>

          </header>


          {/* CONTENT */}

          <main className="dashboard-content">


            {/* LOADING */}

            {loading && (
                <p>
                  Loading...
                </p>
            )}


            {/* ERROR */}

            {error && (

                <p className="error">
                  {error}
                </p>

            )}


            {/* SUCCESS */}

            {message && (

                <p className="success">
                  {message}
                </p>

            )}


            {/* =================================================
               USER DASHBOARD
               ================================================= */}

            {page === "dashboard" && (

                <>

                  <div className="welcome">

                    <h1>
                      Welcome back, {user.name} 👋
                    </h1>

                    <p>
                      Manage your NovaBank account securely.
                    </p>

                  </div>


                  <div className="stats-grid">


                    {/* ACCOUNT */}

                    <div className="stat-card">

                      <div className="stat-top">

                        <strong>
                          Account
                        </strong>

                        <div className="stat-icon">
                          🏦
                        </div>

                      </div>

                      <div className="stat-label">
                        Account Number
                      </div>

                      <div className="stat-value">

                        {account
                            ? account.accountNumber
                            : "------"}

                      </div>

                    </div>


                    {/* BALANCE */}

                    <div className="stat-card">

                      <div className="stat-top">

                        <strong>
                          Balance
                        </strong>

                        <div className="stat-icon">
                          💰
                        </div>

                      </div>

                      <div className="stat-label">
                        Available balance
                      </div>

                      <div className="stat-value">

                        ₹{" "}

                        {account
                            ? Number(
                                account.balance || 0
                            ).toFixed(2)
                            : "0.00"}

                      </div>

                    </div>


                    {/* EMAIL */}

                    <div className="stat-card">

                      <div className="stat-top">

                        <strong>
                          Customer
                        </strong>

                        <div className="stat-icon">
                          👤
                        </div>

                      </div>

                      <div className="stat-label">
                        Registered email
                      </div>

                      <div className="stat-value">
                        {user.email}
                      </div>

                    </div>

                  </div>


                  <section className="section">

                    <div className="section-header">

                      <h2>
                        Banking Services
                      </h2>

                    </div>


                    <div className="action-grid">


                      <button
                          className="action-card"
                          onClick={openDeposit}
                      >

                        <div className="action-icon">
                          💰
                        </div>

                        <div className="action-title">
                          Deposit Money
                        </div>

                        <div className="action-description">
                          Add money to your bank account
                        </div>

                      </button>


                      <button
                          className="action-card"
                          onClick={openWithdraw}
                      >

                        <div className="action-icon">
                          💸
                        </div>

                        <div className="action-title">
                          Withdraw Money
                        </div>

                        <div className="action-description">
                          Withdraw money from your account
                        </div>

                      </button>


                      <button
                          className="action-card"
                          onClick={openTransfer}
                      >

                        <div className="action-icon">
                          ↔️
                        </div>

                        <div className="action-title">
                          Transfer Money
                        </div>

                        <div className="action-description">
                          Send money to another account
                        </div>

                      </button>


                      <button
                          className="action-card"
                          onClick={openTransactions}
                      >

                        <div className="action-icon">
                          📜
                        </div>

                        <div className="action-title">
                          Transaction History
                        </div>

                        <div className="action-description">
                          View your banking activity
                        </div>

                      </button>

                    </div>

                  </section>

                </>

            )}


            {/* =================================================
               DEPOSIT
               ================================================= */}

            {page === "deposit" && (

                <section className="section">

                  <div className="welcome">

                    <h1>
                      💰 Deposit Money
                    </h1>

                    <p>
                      Add money to your bank account.
                    </p>

                  </div>


                  <div className="action-card">

                    <h2>
                      Current Balance
                    </h2>

                    <h1>
                      ₹{" "}

                      {account
                          ? Number(
                              account.balance || 0
                          ).toFixed(2)
                          : "0.00"}

                    </h1>


                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) =>
                            setAmount(e.target.value)
                        }
                    />


                    <br />
                    <br />


                    <button
                        onClick={deposit}
                        disabled={loading}
                    >
                      Deposit Money
                    </button>

                  </div>

                </section>

            )}


            {/* =================================================
               WITHDRAW
               ================================================= */}

            {page === "withdraw" && (

                <section className="section">

                  <div className="welcome">

                    <h1>
                      💸 Withdraw Money
                    </h1>

                    <p>
                      Withdraw money from your bank account.
                    </p>

                  </div>


                  <div className="action-card">

                    <h2>
                      Current Balance
                    </h2>

                    <h1>
                      ₹{" "}

                      {account
                          ? Number(
                              account.balance || 0
                          ).toFixed(2)
                          : "0.00"}

                    </h1>


                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) =>
                            setAmount(e.target.value)
                        }
                    />


                    <br />
                    <br />


                    <button
                        onClick={withdraw}
                        disabled={loading}
                    >
                      Withdraw Money
                    </button>

                  </div>

                </section>

            )}


            {/* =================================================
               TRANSFER
               ================================================= */}

            {page === "transfer" && (

                <section className="section">

                  <div className="welcome">

                    <h1>
                      ↔️ Transfer Money
                    </h1>

                    <p>
                      Send money to another NovaBank account.
                    </p>

                  </div>


                  <div className="action-card">

                    <h2>
                      From Account
                    </h2>

                    <p>
                      {account
                          ? account.accountNumber
                          : "------"}
                    </p>


                    <input
                        type="text"
                        placeholder="Destination account number"
                        value={toAccount}
                        onChange={(e) =>
                            setToAccount(e.target.value)
                        }
                    />


                    <br />
                    <br />


                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) =>
                            setAmount(e.target.value)
                        }
                    />


                    <br />
                    <br />


                    <button
                        onClick={transfer}
                        disabled={loading}
                    >
                      Transfer Money
                    </button>

                  </div>

                </section>

            )}


            {/* =================================================
               TRANSACTION HISTORY
               ================================================= */}

            {page === "transactions" && (

                <section className="section">

                  <div className="section-header">

                    <div>

                      <h2>
                        Transaction History
                      </h2>

                      <p>
                        Your recent banking activity
                      </p>

                    </div>

                  </div>


                  <button
                      onClick={loadTransactions}
                  >
                    Refresh Transactions
                  </button>


                  <br />
                  <br />


                  <div className="table-container">

                    <table className="data-table">

                      <thead>

                      <tr>

                        <th>ID</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Balance After</th>
                        <th>Description</th>
                        <th>Date</th>

                      </tr>

                      </thead>


                      <tbody>

                      {transactions.map((transaction) => (

                          <tr key={transaction.id}>

                            <td>
                              {transaction.id}
                            </td>

                            <td>
                              {transaction.type}
                            </td>

                            <td>
                              ₹{" "}
                              {Number(
                                  transaction.amount || 0
                              ).toFixed(2)}
                            </td>

                            <td>
                              ₹{" "}
                              {Number(
                                  transaction.balanceAfter || 0
                              ).toFixed(2)}
                            </td>

                            <td>
                              {transaction.description}
                            </td>

                            <td>
                              {transaction.createdAt
                                  ? new Date(
                                      transaction.createdAt
                                  ).toLocaleString()
                                  : "-"}
                            </td>

                          </tr>

                      ))}

                      </tbody>

                    </table>

                  </div>

                </section>

            )}


            {/* =================================================
               PROFILE
               ================================================= */}

            {page === "profile" && (

                <section className="section">

                  <div className="welcome">

                    <h1>
                      👤 My Profile
                    </h1>

                    <p>
                      Your NovaBank account information.
                    </p>

                  </div>


                  <div className="table-container">

                    <table className="data-table">

                      <tbody>

                      <tr>

                        <th>
                          Name
                        </th>

                        <td>
                          {user.name}
                        </td>

                      </tr>


                      <tr>

                        <th>
                          Email
                        </th>

                        <td>
                          {user.email}
                        </td>

                      </tr>


                      <tr>

                        <th>
                          Role
                        </th>

                        <td>
                          {user.role}
                        </td>

                      </tr>


                      <tr>

                        <th>
                          Account Number
                        </th>

                        <td>
                          {account
                              ? account.accountNumber
                              : "No account"}
                        </td>

                      </tr>


                      <tr>

                        <th>
                          Balance
                        </th>

                        <td>

                          ₹{" "}

                          {account
                              ? Number(
                                  account.balance || 0
                              ).toFixed(2)
                              : "0.00"}

                        </td>

                      </tr>

                      </tbody>

                    </table>

                  </div>

                </section>

            )}

          </main>

        </div>

      </div>
  );
}


/* =========================================================
   LOGIN
   ========================================================= */

function Login({ onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e) {

    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
          "http://localhost:8080/api/auth/login",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({
              email: email,
              password: password
            })
          }
      );

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();

      onLogin(data);

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  }

  return (
      <div className="login-page">

        {/* LEFT SIDE */}

        <div className="login-left">

          <div className="login-brand">

          <span className="brand-icon">
            🏦
          </span>

            <span className="brand-name">
            <span>Nova</span>Bank
          </span>

          </div>


          <div className="login-left-content">

            <h1>
              Banking made
              <br />
              <span>simple & secure.</span>
            </h1>

            <p>
              Manage your money, accounts and transactions
              securely with NovaBank.
            </p>


            <div className="security-info">

              <div className="security-item">

                <span>🔒</span>

                <div>
                  <strong>
                    Secure Banking
                  </strong>

                  <small>
                    Your data is protected
                  </small>
                </div>

              </div>


              <div className="security-item">

                <span>⚡</span>

                <div>
                  <strong>
                    Fast & Reliable
                  </strong>

                  <small>
                    Bank anytime, anywhere
                  </small>
                </div>

              </div>

            </div>

          </div>


          <div className="login-footer">

            © 2026 NovaBank. All rights reserved.

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="login-right">

          <div className="login-card">


            <div className="login-card-header">

              <div className="login-circle">
                👤
              </div>

              <h2>
                Welcome back
              </h2>

              <p>
                Sign in to your NovaBank account
              </p>

            </div>


            <form onSubmit={login}>


              {/* EMAIL */}

              <div className="form-group">

                <label>
                  Email Address
                </label>

                <div className="input-wrapper">

                <span>
                  ✉️
                </span>

                  <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) =>
                          setEmail(e.target.value)
                      }
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="form-group">

                <label>
                  Password
                </label>

                <div className="input-wrapper">

                <span>
                  🔒
                </span>

                  <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                          setPassword(e.target.value)
                      }
                  />

                </div>

              </div>


              {/* ERROR */}

              {error && (

                  <div className="login-error">
                    ⚠️ {error}
                  </div>

              )}


              {/* LOGIN BUTTON */}

              <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
              >

                {loading
                    ? "Signing in..."
                    : "Sign In"
                }

              </button>


            </form>


            <div className="login-help">

            <span>
              🔐
            </span>

              <p>
                Your connection is secure and encrypted.
              </p>

            </div>


          </div>

        </div>

      </div>
  );
}


/* =========================================================
   APP
   ========================================================= */

function App() {

  const [user, setUser] =
      useState(null);


  /* =========================================================
     LOGOUT
     ========================================================= */

  function logout() {

    setUser(null);

  }


  /* =========================================================
     LOGIN PAGE
     ========================================================= */

  if (!user) {

    return (
        <Login
            onLogin={setUser}
        />
    );

  }


  /* =========================================================
     ADMIN
     ========================================================= */

  if (user.role === "ADMIN") {

    return (

        <AdminDashboard
            user={user}
            logout={logout}
        />

    );

  }


  /* =========================================================
     NORMAL USER
     ========================================================= */

  return (

      <UserDashboard
          user={user}
          logout={logout}
      />

  );
}


export default App;