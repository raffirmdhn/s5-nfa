import users from "./data.mjs";

const index = () => {
  users.map((user, index) => {
    console.log(`${index + 1}. Nama: ${user.nama} | Umur: ${user.umur} | Alamat: ${user.alamat} | Email: ${user.email}`);
  });
};

const store = (user) => {
  users.push(user);
};

const destroy = () => {
  users.pop();
};

export { index, store, destroy };
