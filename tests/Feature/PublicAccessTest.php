<?php

test('guest can access public study material and study program reviews', function () {
    // Materi Belajar / Subtests
    $response = $this->get('/subtests');
    $response->assertStatus(200);

    // Ulasan Prodi
    $response = $this->get('/prodi');
    $response->assertStatus(200);
});

test('guest is redirected to login when trying to access restricted routes', function () {
    // Kesesuaian Jurusan
    $response = $this->get('/jurusan');
    $response->assertRedirect('/login');

    // Tryout
    $response = $this->get('/tryout');
    $response->assertRedirect('/login');
});
