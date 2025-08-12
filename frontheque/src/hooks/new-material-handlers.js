import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import config from "src/utils/config";
import moment from "moment";

export const useNewMaterialHandlers = (data) => {
  const router = useRouter();
  const [superOwner, setSuperOwner] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [tags, setTags] = useState([]);

  const [formData, setFormData] = useState({
    material_title: null,
    team: "",
    owner: null,
    origin: null,
    codeCommande: null,
    codeBarres: null,
    size: null,
    levRisk: null,
    lab_destination: null,
    date_arrivee: null,
    tags: null,
  });

  const [message, setMessage] = useState({
    status: null,
    value: ''
  });

  const [formErrors, setFormErrors]= useState({
    title: false,
    owner: false,
    origin: false,
    team: false,
    lab_destination: false
  });

  const handleChange = useCallback(
    (event) => {
      setFormData((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value 
      }));
    }, 
    []
  );
  
  const onSelectChange = useCallback(
    (event, values) => {
      setSelectedOwner(values);
    },
    []
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormData((prevState) => ({
      ...prevState,
      date_arrivee: date,
    }));
  };

  const handleAddTag = (tag) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  // Updated handleSubmit function in new-material-handlers.js
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsUploading(true);

      const newErrors = {
        title: formData.material_title === null,
        owner: selectedOwner === null,
        origin: formData.origin === null,
        team: formData.team === null,
        lab_destination: formData.lab_destination === null,
      };

      setFormErrors(newErrors);

      if (!Object.values(newErrors).some(error => error)) {
        const form = new FormData();
        const fieldsToAppend = [
          { key: 'material_title', value: formData.material_title },
          { key: 'owner', value: selectedOwner.owner_id },
          { key: 'team', value: formData.team },
          { key: 'origin', value: formData.origin },
          { key: 'codeCommande', value: formData.codeCommande },
          { key: 'codeBarres', value: formData.codeBarres },
          { key: 'size', value: formData.size },
          { key: 'levRisk', value: formData.levRisk },
          { key: 'lab_destination', value: formData.lab_destination },
          { key: 'date_arrivee', value: formData.date_arrivee ? moment(formData.date_arrivee).format('YYYY-MM-DD') : null },
        ];

        // Add tags to the form data
        tags.forEach(tag => {
          form.append('tags', tag);
        });
        
        fieldsToAppend.forEach(({ key, value }) => {
          if (value !== undefined && value !== null && value !== "") {
            form.append(key, value);
          }
        });

        const response = await fetch(`${config.apiUrl}/materials/create/`, {
          method: 'POST',
          body: form,
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          let decodeResponse = JSON.parse(errorMessage);

          const [firstKey] = Object.keys(decodeResponse);
          setMessage({
            status: 'error',
            value: `${firstKey} : ${decodeResponse[firstKey][0]}`,
          });
        } else {
          const data = await response.json();
          setMessage({
            status: 'success',
            value: 'Nouvelle bouteille ajoutée avec succès ! Redirection en cours....',
          });

          setTimeout(() => {
            router.push(`/details/material-detail/${data.material_id}`);
          }, 2000);
        }
      }
      setIsUploading(false);
    }, 
    [formData, router, selectedOwner, tags]
  );

  useEffect(() => {
    if (data) {
      const owner = data.find(
        (owner) =>
          owner.is_staff && owner.owner_name.toLowerCase().includes('liphy')
      );
      setSuperOwner(owner);
    }
  }, [data]);

  return {
    formData,
    message,
    formErrors,
    isUploading,
    selectedOwner,
    onSelectChange,
    handleChange,
    handleSubmit,
    handleDateChange,
    tags,
    handleAddTag,
    handleDeleteTag,
  };
};

