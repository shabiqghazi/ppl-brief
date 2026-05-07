const mockData = {
  periods: [
    { id: 1, name: "Angkatan 2026 Ganjil", type: "Reguler", status: "Active", regStart: "2026-08-01", regEnd: "2026-08-15" },
    { id: 2, name: "PPL Internasional Malaysia", type: "Internasional", status: "Closed", regStart: "2026-01-10", regEnd: "2026-01-25" }
  ],
  schools: [
    { id: 1, name: "MAN 1 Bandung", quota: { PAI: 5, PBA: 3 }, selected: 2 },
    { id: 2, name: "SMAN 8 Bandung", quota: { PAI: 4, PGMI: 2 }, selected: 6 },
    { id: 3, name: "MTsN 2 Kota Bandung", quota: { PAI: 3, PBA: 2 }, selected: 1 }
  ],
  students: [
    { id: "123001", name: "Budi Santoso", prodi: "PAI", status: "Active", school: "MAN 1 Bandung", period: "Angkatan 2026 Ganjil", dpl: "Dr. Ahmad" },
    { id: "123002", name: "Siti Aminah", prodi: "PBA", status: "Registered", school: null, period: "Angkatan 2026 Ganjil", dpl: "Dra. Siti" }
  ],
  currentUser: {
    mhs: { id: "123001", name: "Budi Santoso", role: "mahasiswa" },
    admin: { id: "adm01", name: "Super Admin", role: "admin" },
    dpl: { id: "dpl01", name: "Dr. Ahmad", role: "dpl" }
  }
};

// Simple storage simulation
const store = {
  get: (key) => JSON.parse(localStorage.getItem(`ppl_${key}`)) || mockData[key],
  set: (key, val) => localStorage.setItem(`ppl_${key}`, JSON.stringify(val))
};
