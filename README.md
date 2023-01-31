Треба зробити калькулятор на прикладі https://wasabi.com/cloud-storage-pricing/#cost-estimates, який буде порівнювати ціни різних провайдерів.

Опис завдання:
●	Приклад дизайну на малюнку нижче, але можете робити на власний розсуд.

●	Графік вертикальний для широких екранів та горизонтальний для вузьких.

●	Дві шкали Storage і Transfer у GB, з кроком в 1 GB та діапазоном від 0 до 1000 GB.

●	Іконки на сайтах провайдерів. Ціни не відповідають реальним та вказані за 1 GB.

●	Стовпчик з найнижчою ціною кольору провайдера (червоний, оранжевий, фіолетовий, блакитний). Інші стовпчики сірі.

●	Зовнішність (HTML, CSS) не так важлива, як правильність (JS).


 

Ціни для калькулятору:
1) backblaze.com:
●	мінімальний платіж 7$.
●	ціна Storage: $0.005.
●	ціна Transfer: $0.01.

2) bunny.net:
●	має бути можливість переключатись між опціями HDD та SSD.
●	максимальний платіж 10$.
●	ціна Storage:
●	HDD - $0.01.
●	SSD - $0.02.
●	ціна Transfer: будь-яка опція - $0.01.

●	3) scaleway.com:
●	має бути можливість переключатись між опціями Multi та Single.
●	ціна Storage:
●	Multi - 75 GB безкоштовно, потім $0.06.
●	Single - 75 GB безкоштовно, потім $0.03.
●	ціна Transfer: будь-яка опція - 75 GB безкоштовно, потім $0.02.

4) vultr.com:
●	мінімальний платіж 5$.
●	ціна Storage: $0.01.
●	ціна Transfer: $0.01.

Приклади для перевірки правильності розрахунку:
а) Storage 50 GB, Transfer 50 GB:
1.	backblaze.com = 7$.
2.	bunny.net HDD = 1$, SSD = 1.5$.
3.	scaleway.com Multi = 0$, Single = 0$.
4.	vultr.com = 5$.

б) Storage 100 GB, Transfer 200 GB:
1.	backblaze.com = 7$.
2.	bunny.net HDD = 3$, SSD = 4$.
3.	scaleway.com Multi = 4$, scaleway.com Single = 3.25$.
4.	vultr.com = 5$.

в) Storage 300 GB, Transfer 300 GB:
1.	backblaze.com = 7$.
2.	bunny.net HDD = 6$, SSD = 9$.
3.	scaleway.com Multi = 18$, Single = 11.25$.
4.	vultr.com = 6$.

г) Storage 1000 GB, Transfer 1000 GB:
1.	backblaze.com = 15$.
2.	bunny.net HDD = 10$, bunny.net SSD = 10$.
3.	scaleway.com Multi = 74$, Single = 46.25$.
4.	vultr.com = 20$.
