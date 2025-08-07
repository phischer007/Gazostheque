// import { Typography, Chip, Box } from "@mui/material";
// import { useState, useEffect, useCallback } from "react";
// import config from "src/utils/config";

// export default function InputTags() {
//     const [tags, setTags] = useState([]);
//     const [tagsList, setTagsList] = useState(null);

//     useEffect(() => {
//         fetch(`${config.apiUrl}/tags/`)
//             .then(response => response.json())
//             .then(data => {
//                 setTagsList(data);
//             })
//             .catch(error => console.error('Error fetching data:', error));
//     }, []);

//     const handleOnClick = useCallback((tag) => {
//         if (tags.length < 5 && !tags.some(t => t.tag_id === tag.tag_id)) {
//             setTags([...tags, tag]);
//         }else{
//             const newTags = tags.filter((t) => tag.tag_id !== t.tag_id);
//             setTags(newTags);
//         }
//     }, [tags]);

//     return (
//         <Box sx={{ padding: "0 1rem", position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
//             <Typography variant="caption">
//                 Choisissez jusqu&apos;à cinq balises pour classer le contenu.
//             </Typography>
//             <Box 
//                 sx={{ 
//                     marginTop: 1, 
//                     display: 'flex', 
//                     flexWrap: 'wrap', 
//                     alignItems: 'center', 
//                     gap: '0.2rem', 
//                     width: '100%' 
//                 }}
//             >
//                 {tagsList && tagsList.map((tag) => {
//                     return <Chip
//                         key={tag.tag_id}
//                         label={tag.markup}
//                         color={tags.some(t => t.tag_id === tag.tag_id) ? "primary": "gray"}
//                         variant={tags.some(t => t.tag_id === tag.tag_id) ? "filled": "outlined"}
//                         onClick={()=> handleOnClick(tag)}
//                     />
//                 })}
//             </Box>
//         </Box >
//     );
// }

import { Typography, Chip, Box, CircularProgress } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import config from "src/utils/config";

export default function InputTags() {
    const [tags, setTags] = useState([]);
    const [tagsList, setTagsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${config.apiUrl}/tags/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tags');
                }
                const data = await response.json();
                setTagsList(data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    const handleOnClick = useCallback((tag) => {
        if (tags.length < 5 && !tags.some(t => t.tag_id === tag.tag_id)) {
            setTags([...tags, tag]);
        } else {
            const newTags = tags.filter((t) => tag.tag_id !== t.tag_id);
            setTags(newTags);
        }
    }, [tags]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2, color: 'error.main' }}>
                Error loading tags: {error}
            </Box>
        );
    }

    return (
        <Box sx={{ padding: "0 1rem", position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant="caption">
                Choisissez jusqu&apos;à cinq balises pour classer le contenu.
            </Typography>
            <Box 
                sx={{ 
                    marginTop: 1, 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    alignItems: 'center', 
                    gap: '0.2rem', 
                    width: '100%' 
                }}
            >
                {tagsList.length > 0 ? (
                    tagsList.map((tag) => (
                        <Chip
                            key={tag.tag_id}
                            label={tag.markup}
                            color={tags.some(t => t.tag_id === tag.tag_id) ? "primary" : "default"}
                            variant={tags.some(t => t.tag_id === tag.tag_id) ? "filled" : "outlined"}
                            onClick={() => handleOnClick(tag)}
                        />
                    ))
                ) : (
                    <Typography variant="body2" 
                        color="text.secondary"
                    >
                        No tags available
                    </Typography>
                )}
            </Box>
        </Box>
    );
}