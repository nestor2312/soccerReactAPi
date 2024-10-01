
// // Importa los archivos CSS de AdminLTE
// import 'admin-lte/dist/css/adminlte.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// import 'bootstrap/dist/css/bootstrap.min.css';  // Si deseas usar Bootstrap

// // Importa los archivos JavaScript de AdminLTE
// import 'admin-lte/dist/js/adminlte.min.js';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Si deseas usar Bootstrap



function Admin() {
   
  return (
    <div className="wrapper">
    {/* Navbar */}
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars"></i>
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a href="/" className="nav-link">Home</a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a href="/about" className="nav-link">About</a>
        </li>
      </ul>
    </nav>

    {/* Sidebar */}
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <a href="/" className="brand-link">
        <span className="brand-text font-weight-light">AdminLTE 3</span>
      </a>
      <div className="sidebar">
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" role="menu">
            <li className="nav-item">
              <a href="/" className="nav-link">
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>Dashboard</p>
              </a>
            </li>
            <li className="nav-item">
              <a href="/users" className="nav-link">
                <i className="nav-icon fas fa-users"></i>
                <p>Users</p>
              </a>
            </li>
            <li className="nav-item">
              <a href="/settings" className="nav-link">
                <i className="nav-icon fas fa-cogs"></i>
                <p>Settings</p>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>

    {/* Content Wrapper */}
    <div className="content-wrapper">
      <section className="content">
        <div className="container-fluid">
          {/* Small boxes (Stat box) */}
          <div className="row">
            <div className="col-lg-3 col-6">
              {/* small box */}
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>150</h3>
                  <p>New Orders</p>
                </div>
                <div className="icon">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <a href="#" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box bg-success">
                <div className="inner">
                  <h3>53<sup style={{ fontSize: '20px' }}>%</sup></h3>
                  <p>Bounce Rate</p>
                </div>
                <div className="icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <a href="#" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box bg-warning">
                <div className="inner">
                  <h3>44</h3>
                  <p>User Registrations</p>
                </div>
                <div className="icon">
                  <i className="fas fa-user-plus"></i>
                </div>
                <a href="#" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>65</h3>
                  <p>Unique Visitors</p>
                </div>
                <div className="icon">
                  <i className="fas fa-users"></i>
                </div>
                <a href="#" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Main row */}
          <div className="row">
            {/* Left col */}
            <section className="col-lg-7 connectedSortable">
              {/* Custom content */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Example Chart</h3>
                  <div className="card-tools">
                    <button type="button" className="btn btn-tool">
                      <i className="fas fa-minus"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  {/* Aquí va tu gráfico o contenido */}
                  <p>Esta es una plantilla básica de AdminLTE integrada en React.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>

    {/* Footer */}
    <footer className="main-footer">
      <div className="float-right d-none d-sm-inline">Anything you want</div>
      <strong>Copyright © 2024</strong> All rights reserved.
    </footer>
  </div>
  );
}

export default Admin;
