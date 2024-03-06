import React, { useEffect, useState } from 'react'
import "./form.style.css"
import axios from "axios";

export default function Form() {
    const [countires, setCountries] = useState([]);
    const [fetchAfterSubmit, setFetchAfterSubmit] = useState(true);
    const [existingEdit, setExistingEdit] = useState(false);
    const [idToUpdate, setIdToUpdate] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        tel: "",
        address: "",
        country: "",
        gender: "",
        subscription: "",
    });

    const [DataToShowInGrid, setDataToSHowInGrid] = useState([]);
    // Frontend: Form Component
    useEffect(() => {
        axios.get("http://localhost:8000/getCountires").then((res) => {
            setCountries(res.data);
        }).catch((error) => {
            console.error("Error fetching countries:", error);
        });
    }, []);

    const [subScription, setSubscription] = useState({
        weekly: false,
        monthly: false,
        yearly: false
    });

    useEffect(() => {
        if (fetchAfterSubmit) {
            axios.get("http://localhost:8000/formData").then((res) => {
                console.log(res.data);
                if (res.status === 200) {
                    setDataToSHowInGrid(res.data);
                    
                }
            })
        };
        setFetchAfterSubmit(false);
    }, [fetchAfterSubmit])



    const handlesubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (
            formData.address &&
            formData.email &&
            formData.gender &&
            formData.name &&
            formData.subscription &&
            formData.tel
        ) {
            axios.post("http://localhost:8000/form", formData).then((res) => {
                console.log(res);
                setFetchAfterSubmit(true);
                if (res.status === 200) {
                    setFormData({
                        name: "",
                        email: "",
                        tel: "",
                        address: "",
                        country: "",
                        gender: "",
                        subscription: "",
                    });
                    setSubscription({
                        weekly: false,
                        monthly: false,
                        yearly: false
                    })
                }
            }).catch((error) => {
                console.error("Error submitting form:", error);
            });
        } else {
            window.alert("Please fill all the required fields!");
        }
    };
    const handleEdit = (e, data) => {
        setIdToUpdate(data._id);
        setExistingEdit(true);
        e.preventDefault();
        setFormData(data);
    }
    const handleUpdate = () => {
        axios.put("http://localhost:8000/update/" + idToUpdate, formData).then((res) => {
            setFetchAfterSubmit(true);
            setExistingEdit(false);
            setFormData({
                name: "",
                email: "",
                tel: "",
                address: "",
                country: "",
                gender: "",
                subscription: "",
            });
            setSubscription({
                weekly: false,
                monthly: false,
                yearly: false
            });
        })
            .catch((error) => {
                console.error("Error updating form:", error);
            });
    }
    return (
        <div style={{ width: "100%", height: "100%", }}>
            <form className='formDaataOuter'>
                <div style={{ display: "flex", flexDirection: "row", gap: 15, alignItems: "center", height: 40 }}>
                    <label className='labelField'>Name</label>
                    <input value={formData.name} type="text" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div style={{ display: "flex", flexDirection: "row", gap: 15, alignItems: "center", height: 40 }}>
                    <label className='labelField'>Email</label>
                    <input value={formData.email} type="email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div style={{ display: "flex", flexDirection: "row", gap: 15, alignItems: "center", height: 40 }}>
                    <label className='labelField'>Telephone</label>
                    <input
                        value={formData.tel}
                        type="tel"
                        pattern="[0-9]*"
                        maxLength={10}
                        onChange={(e) => {
                            const number = e.target.value;
                            let reg = /[0-9]/;
                            console.log(reg.test(number), "textstdsadsads");
                            if (reg.test(number)) {
                                setFormData({ ...formData, tel: e.target.value });
                            }
                        }} />
                </div>
                <div style={{ display: "flex", flexDirection: "row", gap: 15, alignItems: "center", height: 40 }}>
                    <label className='labelField'>Address</label>

                    <input value={formData.address} type="text" onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
                <div style={{ display: "flex", flexDirection: "row", gap: 15, alignItems: "center", height: 40 }}>
                    <label className='labelField'>Country</label>
                    <select style={{ width: 100, height: 20 }} onClick={(e) => setFormData({ ...formData, country: e.target.value })}>
                        {countires.map((e, i) =>
                            <option key={i} value={e}>{e}</option>
                        )}
                    </select>
                </div>
                <div style={{ display: "flex" }}>
                    <label>Gender</label>
                    <div style={{ display: "flex", alignItems: "center", marginLeft: 30, gap: 10 }}>
                        <label>Male</label>
                        <input type="radio" name="gender" value={"male"} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", marginLeft: 30, gap: 10 }}>
                        <label>Female</label>
                        <input type="radio" name="gender" value={"Female"} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} />
                    </div>
                </div>
                <label for="checkbox" id='checkbox'>SubScription</label>
                <div style={{ display: "flex", flexDirection: "row", gap: 15, alignItems: "center", height: 40 }}>
                    <label for="checkbox" id='checkbox'>Monthly</label>
                    <input type="checkbox" checked={subScription.monthly} id="checkbox" name="subscription" onClick={() => {

                        setSubscription({ yearly: false, weekly: false, monthly: !subScription.monthly });
                        setFormData({ ...formData, subscription: "Monthly" })
                    }
                    } />
                    <label for="checkbox" id='checkbox'>weekly</label>
                    <input type="checkbox" checked={subScription.weekly} id="checkbox" name="subscription" onClick={() => {
                        setSubscription({ yearly: false, monthly: false, weekly: !subScription.weekly });
                        setFormData({ ...formData, subscription: "weekly" })

                    }
                    } />
                    <label for="checkbox" id='checkbox'>Yearly</label>
                    <input type="checkbox" checked={subScription.yearly} id="checkbox" name="subscription" onClick={() => {

                        setSubscription({ ...subScription, yearly: !subScription.yearly, monthly: false, weekly: false });
                        setFormData({ ...formData, subscription: "yearly" })
                    }} />
                </div>
                {existingEdit ? <button onClick={handleUpdate}>Edit</button> : <button onClick={handlesubmit}>Submit</button>}
            </form>
            {DataToShowInGrid && DataToShowInGrid.length > 0 && <div>
                {DataToShowInGrid.map((data, i) => (
                    <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                        <div>Address: {data.address}</div>
                        <div>Email: {data.email}</div>
                        <div>Gender : {data.gender}</div>
                        <div>Name : {data.name}</div>
                        <div>subscription : {data.subscription}</div>
                        <div>Telephone : {data.tel}</div>
                        <button onClick={(e) => { handleEdit(e, data) }}>
                            Edit
                        </button>
                    </div>
                ))}
            </div>}
        </div>
    )
}
