/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import Menu from "../Menu/Menu";
import "./index.css";
import axios from "axios";
import { API_ENDPOINT } from '../../ConfigAPI';
const endpoint = API_ENDPOINT;



const Grupos = () => {
  const [Groups, setGroups] = useState([]);

  useEffect(() => {
    const getGroupsAll = async () => {
      try {
        const response = await axios.get(`${endpoint}/grupos`);
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    getGroupsAll();
  }, []);

  return (
    <>
      <Menu />
      <section className="Equipos">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-6 mt-4">
              {Groups.map((grupo) => (
                <div key={grupo.id} className="card border-0 shadow">
                  <div className="card-header fondo-card TITULO border-0">
                    {grupo.nombre}
                  </div>
                  <div className="card table-responsive border-0 table-sm">
                    <table className="table table-borderless">
                      <thead>
                        <tr className="py-2">
                          <th></th>
                         
                        </tr>
                      </thead>
                      
                     
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Grupos;
