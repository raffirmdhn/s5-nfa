import { index, store, destroy } from "./controller.mjs";

const main = () => {
  console.log("Data Awal:");
  index();

  console.log("\nMenambahkan 2 Data Baru...");
  store({
    nama: "Joko Susilo",
    umur: 25,
    alamat: "Surabaya",
    email: "joko@example.com"
  });
  store({
    nama: "Kirana Putri",
    umur: 22,
    alamat: "Yogyakarta",
    email: "kirana@example.com"
  });

  console.log("\nData Setelah Ditambah:");
  index();

  console.log("\nMenghapus Data Terakhir...");
  destroy();

  console.log("\nData Setelah Dihapus:");
  index();
};

main();
