import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ana Sayfa'), centerTitle: true),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Merhaba! Bu uygulamanın Ana Sayfası',
              style: TextStyle(fontSize: 20),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // Örnek olarak başka sayfaya geçiş
                Navigator.pushNamed(context, '/profile');
              },
              child: const Text('Profile Sayfasına Git'),
            ),
          ],
        ),
      ),
    );
  }
}
