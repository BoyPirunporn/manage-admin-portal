"use server";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';


// export const created = async (data: MenuModel) => {
//     await fetch(baseUrl + "/api/menu/created", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(data)
//     });
// };