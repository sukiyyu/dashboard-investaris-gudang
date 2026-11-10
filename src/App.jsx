
import { useState, useEffect, useMemo } from "react";
import {
  initialItems,
  getStockStatus,
  formatRupiah
} from "./data";

function StatCard({ title, value, icon, color }) {
  return (
    <div className="col-md-6 col-xl-3">
      <div className="stat-card">
        <div className={`stat-icon ${color}`}>
          <i className={`bi ${icon}`}></i>
        </div>
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );
}

function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("inventaris_suci");
    return saved ? JSON.parse(saved) : initialItems;
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const emptyForm = {
    code: "",
    name: "",
    category: "Elektronik",
    stock: 0,
    buyPrice: 0,
    sellPrice: 0,
    location: ""
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    localStorage.setItem("inventaris_suci", JSON.stringify(items));
  }, [items]);

  const totalStock = items.reduce(
    (total, item) => total + Number(item.stock),
    0
  );

  const safeItems = items.filter(item => item.stock > 10).length;
  const lowItems = items.filter(
    item => item.stock > 0 && item.stock <= 10
  ).length;
  const emptyItems = items.filter(item => item.stock === 0).length;

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        category === "Semua" || item.category === category;

      return matchSearch && matchCategory;
    });
  }, [items, search, category]);

  function openAddModal() {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  }

  function openEditModal(item) {
    setForm({ ...item });
    setEditId(item.id);
    setShowModal(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm(previous => ({
      ...previous,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newItem = {
      ...form,
      stock: Number(form.stock),
      buyPrice: Number(form.buyPrice),
      sellPrice: Number(form.sellPrice)
    };

    if (editId !== null) {
      setItems(previous =>
        previous.map(item =>
          item.id === editId ? { ...newItem, id: editId } : item
        )
      );
    } else {
      setItems(previous => [
        ...previous,
        { ...newItem, id: Date.now() }
      ]);
    }

    setShowModal(false);
    setForm(emptyForm);
    setEditId(null);
  }

  function deleteItem(id) {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus barang ini?"
    );

    if (confirmDelete) {
      setItems(previous =>
        previous.filter(item => item.id !== id)
      );
    }
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h3><i className="bi bi-box-seam"></i> GudangKu</h3>
        <hr />

        <a href="#dashboard" className="active">
          <i className="bi bi-grid"></i> Dashboard
        </a>

        <a href="#inventaris">
          <i className="bi bi-boxes"></i> Data Inventaris
        </a>

        <div className="sidebar-user">
          <strong>Suci Umi Kholifah</strong>
          <small>NIM: 2511501003</small>
        </div>
      </aside>

      <main className="main-content">
        <div className="top-header">
          <div>
            <h3>Dashboard Inventaris</h3>
            <p>Selamat datang di sistem inventaris gudang</p>
          </div>

          <div className="profile">
            <i className="bi bi-person-circle"></i> Admin
          </div>
        </div>

        <section className="welcome-panel mb-4" id="dashboard">
          <h3>Selamat Datang, Suci!</h3>
          <p>
            Kelola dan pantau persediaan barang gudang
            dengan mudah melalui dashboard ini.
          </p>
        </section>

        <div className="row g-3 mb-4">
          <StatCard
            title="Jenis Barang"
            value={items.length}
            icon="bi-box-seam"
            color="blue"
          />

          <StatCard
            title="Total Stok"
            value={totalStock}
            icon="bi-boxes"
            color="green"
          />

          <StatCard
            title="Stok Menipis"
            value={lowItems}
            icon="bi-exclamation-triangle"
            color="orange"
          />

          <StatCard
            title="Stok Habis"
            value={emptyItems}
            icon="bi-x-circle"
            color="red"
          />
        </div>

        <section className="inventory-card" id="inventaris">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <div>
              <h4>Data Inventaris Barang</h4>
              <small className="text-muted">
                Daftar seluruh barang di gudang
              </small>
            </div>

            <button
              className="btn btn-primary"
              onClick={openAddModal}
            >
              <i className="bi bi-plus-lg"></i> Tambah Barang
            </button>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-md-7">
              <input
                type="text"
                className="form-control"
                placeholder="Cari kode atau nama barang..."
                value={search}
                onChange={event => setSearch(event.target.value)}
              />
            </div>

            <div className="col-md-5">
              <select
                className="form-select"
                value={category}
                onChange={event => setCategory(event.target.value)}
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Aksesoris">Aksesoris</option>
                <option value="ATK">ATK</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Nama Barang</th>
                  <th>Kategori</th>
                  <th>Stok</th>
                  <th>Harga Beli</th>
                  <th>Harga Jual</th>
                  <th>Lokasi</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => {
                    const status = getStockStatus(
                      Number(item.stock)
                    );

                    return (
                      <tr key={item.id}>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>{item.stock}</td>
                        <td>{formatRupiah(item.buyPrice)}</td>
                        <td>{formatRupiah(item.sellPrice)}</td>
                        <td>{item.location}</td>
                        <td>
                          <span
                            className={`badge ${
                              status === "Aman"
                                ? "bg-success"
                                : status === "Menipis"
                                ? "bg-warning text-dark"
                                : "bg-danger"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openEditModal(item)}
                              title="Edit"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteItem(item.id)}
                              title="Hapus"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      Data barang tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="footer">
          Responsi PFS A1 © 2026 - Suci Umi Kholifah
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="d-flex justify-content-between mb-3">
              <h4>
                {editId !== null ? "Edit Barang" : "Tambah Barang"}
              </h4>

              <button
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Kode Barang</label>
                <input
                  className="form-control"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Nama Barang</label>
                <input
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Kategori</label>
                <select
                  className="form-select"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option>Elektronik</option>
                  <option>Aksesoris</option>
                  <option>ATK</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Jumlah Stok</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Harga Beli</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  name="buyPrice"
                  value={form.buyPrice}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Harga Jual</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  name="sellPrice"
                  value={form.sellPrice}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Lokasi Rak</label>
                <input
                  className="form-control"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>

                <button type="submit" className="btn btn-primary">
                  Simpan Barang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
