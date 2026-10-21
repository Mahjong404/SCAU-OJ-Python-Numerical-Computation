#include <cstdio>

using namespace std;

double sine(double value) {
    long double x = value, term = x, sum = x;
    for (int n = 1; ; ++n) {
        term *= -x * x / ((2 * n) * (2 * n + 1));
        long double next = sum + term;
        if (next == sum) return static_cast<double>(sum);
        sum = next;
    }
}

int main() {
    int m;
    scanf("%d", &m);
    while (m--) {
        double x;
        scanf("%lf", &x);
        printf("%.14f\n", sine(x));
    }
    return 0;
}
