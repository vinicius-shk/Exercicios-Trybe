-- Exercício 5: Utilizando o RIGHT JOIN, faça uma busca que retorne todos os dados dos filmes, mesmo os que não estão em cartaz e, adicionalmente, os dados dos cinemas que possuem estes filmes em cartaz. Retorne os nomes dos cinemas em ordem alfabética.

SELECT m.*, t.*
FROM Pixar.Theater t
RIGHT JOIN Pixar.Movies m
ON t.id = m.theater_id
ORDER BY t.`name`;